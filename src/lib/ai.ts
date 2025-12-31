import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.PINECONE_API_KEY) {
    throw new Error('Missing PINECONE_API_KEY environment variable');
}

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const INDEX_NAME = 'todo-chatbot';

export async function getEmbeddings(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 1536,
    });
    return response.data[0].embedding;
}

export async function upsertTodoToPinecone(todo: {
    id: string;
    title: string;
    description: string;
    userId: string;
    email: string;
}) {
    const index = pc.index(INDEX_NAME);
    const textToEmbed = `Title: ${todo.title}\nDescription: ${todo.description}`;
    const embedding = await getEmbeddings(textToEmbed);

    await index.upsert([
        {
            id: todo.id,
            values: embedding,
            metadata: {
                userId: todo.userId,
                title: todo.title,
                description: todo.description,
                email: todo.email,
            },
        },
    ]);
}

export async function deleteTodoFromPinecone(todoId: string) {
    const index = pc.index(INDEX_NAME);
    await index.deleteOne(todoId);
}

export async function queryTodos(userId: string, email: string, queryText: string) {
    const index = pc.index(INDEX_NAME);
    const queryEmbedding = await getEmbeddings(queryText);

    const queryResponse = await index.query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
        filter: {
            userId: { $eq: userId },
            email: { $eq: email },
        },
    });

    return queryResponse.matches.map((match) => match.metadata);
}
