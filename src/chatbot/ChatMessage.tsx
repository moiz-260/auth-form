import React from "react";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";
  const normalizeText = (text: string) => {
    return text
      .replace(/\r\n/g, '\n')        // normalize line endings
      .replace(/\n{3,}/g, '\n\n')    // max 1 empty line
      .trim();
  };


  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"
        } mb-4 animate-slide-in`}
    >
      <div
        className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"
          }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-black text-white" : "bg-black text-white"
            }`}
        >
          {isUser ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${isUser
            ? "bg-black text-white rounded-tr-none"
            : "bg-white/60 backdrop-blur-xl text-gray-800 border border-white/30 rounded-tl-none"
            }`}
        >
          <p className="text-sm whitespace-pre-line break-words"
          >
            <ReactMarkdown>{normalizeText(message.text)}</ReactMarkdown>
          </p>
          <p
            className={`text-xs mt-1 ${isUser ? "text-gray-300" : "text-gray-500"
              }`}
          >
            {message.timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
