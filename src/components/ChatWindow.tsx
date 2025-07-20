import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatWindowProps {
  messages: Message[];
  onSend: (message: string) => void;
  inputDisabled?: boolean;
  onVoiceInput?: () => void;
  isListening?: boolean;
}

const AVATARS = {
  user: "🧑",
  bot: "🤖",
};
const LABELS = {
  user: "You",
  bot: "AI",
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, inputDisabled, onVoiceInput, isListening }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] max-h-[90vh] w-full max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-b from-purple-100 to-white">
        <span className="font-semibold text-lg text-purple-700">채팅</span>
        {onVoiceInput && (
          <button
            className={`px-4 py-1 rounded-lg font-bold text-white transition ${isListening ? "bg-red-500" : "bg-purple-600 hover:bg-purple-700"}`}
            onClick={onVoiceInput}
            type="button"
          >
            {isListening ? "듣는 중..." : "음성모드"}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 text-xl">대화를 시작해보세요!</div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{AVATARS[msg.sender]}</span>
                  <span className={`text-xs font-bold ${msg.sender === "bot" ? "text-purple-600" : "text-gray-500"}`}>{LABELS[msg.sender]}</span>
                </div>
                <div
                  className={`w-full rounded-xl shadow px-6 py-5 ${msg.sender === "bot" ? "bg-purple-50" : "bg-white"} text-lg leading-relaxed`}
                  style={{ minHeight: "3.5rem" }}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput onSend={onSend} disabled={inputDisabled} />
    </div>
  );
};

export default ChatWindow; 