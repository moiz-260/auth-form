import { NextRequest, NextResponse } from 'next/server';
import { openai, pc } from '@/src/lib/ai';

const INDEX_NAME = 'todo-chatbot';

export async function POST(request: NextRequest) {
    try {
        const { message, userId, email } = await request.json();

        if (!message || (!userId && !email)) {
            return NextResponse.json(
                { error: 'Message and (userId or email) are required' },
                { status: 400 }
            );
        }

        // 1. Get embedding for the user message
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: message,
            dimensions: 1536,
        });
        const embedding = embeddingResponse.data[0].embedding;

        // 2. Query Pinecone for relevant todos
        const index = pc.index(INDEX_NAME);
        const filter: any = {};
        if (email) filter.email = { $eq: email };
        else filter.userId = { $eq: userId };

        const queryResponse = await index.query({
            vector: embedding,
            topK: 5,
            includeMetadata: true,
            filter,
        });

        const relevantTodos = queryResponse.matches.map((match: any) => ({
            title: match.metadata.title,
            description: match.metadata.description,
        }));

        // 3. Construct prompt for OpenAI
        const context = relevantTodos.length > 0
            ? relevantTodos.map((t: any) => `- Title: ${t.title}\n  Description: ${t.description}`).join('\n\n')
            : "No relevant todos found.";

        const prompt = `
You are a helpful Todo Assistant. Your goal is to help the user manage and find information about their todos.
The user's query is: "${message}"

Here are the relevant todos found in their account:
${context}

Based on the above context, please answer the user's query. If the user is asking to create or delete something, remind them that you can currently only search and provide information, but they can use the UI to make changes. Be friendly and concise.
        `;

        // 4. Get response from OpenAI
        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful Todo Assistant.' },
                { role: 'user', content: prompt }
            ],
        });

        const botMessage = chatResponse.choices[0].message.content;

        return NextResponse.json({ message: botMessage }, { status: 200 });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat', details: error.message },
            { status: 500 }
        );
    }
}
