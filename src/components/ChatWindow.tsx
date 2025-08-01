import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Spinner from "./ui/Spinner";


export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatWindowProps {
  messages: Message[];
  onSend: (message: string) => void;
  loading: boolean;
  onVoiceInput: () => void;
  isListening: boolean;
  voiceMode: boolean;
  resetConversation: () => void;
  feedback: Record<number, "like" | "dislike" | null>;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onCopy: (text: string) => void;
  copyNotice: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSend,
  loading,
  onVoiceInput,
  isListening,
  voiceMode,
  resetConversation,
  feedback,
  onLike,
  onDislike,
  onCopy,
  copyNotice,
  inputValue,
  onInputChange,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSend(inputValue);
      onInputChange("");
    }
  };

  return (
    <>  
      <div className="flex-1 overflow-y-auto p-4 pb-50">
        {messages.length === 0 ? (
          <div className="flex flex-1 min-h-[40vh] items-center justify-center">
            <span className="text-center text-gray-400 text-xl">대화를 시작해보세요!</span>
          </div>
        ) : (
          messages.map(msg => {
            if (msg.sender === "user") {
              return (
                <div key={msg.id} className="flex justify-end mb-4">
                  <div className="max-w-xl w-fit text-base text-gray-800 bg-transparent p-0">
                    <div className="text-right text-gray-400 text-xs mb-1">나</div>
                    <div className="font-medium break-words whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={msg.id} className="flex justify-start mb-4">
                  <div className="max-w-xl w-fit text-[17px] text-gray-900 bg-transparent p-0">
                    <div className="text-left text-purple-600 text-xs mb-1">팩트폭격기</div>
                    <div className="font-semibold break-words markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                    {/* 액션 아이콘 */}
                    <div className="flex gap-4 mt-2 text-base select-none">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          title="좋아요"
                          onClick={() => onLike(msg.id)}
                          className={`transition transform hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center
                            ${feedback[msg.id] === "like"
                              ? "bg-yellow-100 text-yellow-600 ring-2 ring-yellow-200 scale-110"
                              : "bg-transparent text-gray-400"}
                          `}
                        >
                          👍
                        </button>
                        <button
                          type="button"
                          title="싫어요"
                          onClick={() => onDislike(msg.id)}
                          className={`transition transform hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center
                            ${feedback[msg.id] === "dislike"
                              ? "bg-yellow-100 text-yellow-600 ring-2 ring-yellow-200 scale-110"
                              : "bg-transparent text-gray-400"}
                          `}
                        >
                          👎
                        </button>
                      </div>
                      <button
                        type="button"
                        title="복사"
                        onClick={() => onCopy(msg.text)}
                        className="hover:scale-110 transition text-gray-400"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })
        )}
        {/* 작성 중 로딩 UI */}
        {loading && (
          <div className="flex items-center gap-3 text-purple-600 text-lg font-bold animate-fade-in">
            <Spinner size={28} />
            <span>팩트폭격기 작성 중...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 복사 안내 메시지 */}
      {copyNotice && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-lg px-4 py-2 shadow-lg opacity-90 z-50 animate-fade-in">
          복사되었습니다
        </div>
      )}

      {/* 중앙 입력 카드 */}
      <div className="w-full max-w-2xl fixed bottom-0 left-1/2 -translate-x-1/2 pb-8 flex flex-col items-center z-10">
        <div className="w-full bg-white rounded-3xl shadow-xl px-2 sm:px-8 py-5 flex flex-col items-center">
          <div className="w-full flex items-center gap-2">
            <button
              className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm border bg-gray-200 transition hover:bg-gray-300 flex-shrink-0"
              onClick={resetConversation}
              type="button"
              title="새로운 대화"
            >
              <span className="text-xl font-bold text-gray-700">+</span>
            </button>
            <div className="flex-grow min-w-0">
              <MessageInput
                value={inputValue}
                onChange={onInputChange}
                onSend={handleSendMessage}
                disabled={loading}
              />
            </div>
            <button
              className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm border transition flex-shrink-0
                ${isListening ? "bg-red-500 animate-pulse" : voiceMode ? "bg-purple-600" : "bg-black"}`}
              onClick={onVoiceInput}
              type="button"
              title="음성모드"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="14" fill="none" />
                <rect x="7" y="8" width="2" height="12" rx="1" fill="white" />
                <rect x="12" y="4" width="2" height="20" rx="1" fill="white" />
                <rect x="17" y="8" width="2" height="12" rx="1" fill="white" />
                <rect x="22" y="12" width="2" height="4" rx="1" fill="white" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-4 text-gray-400 text-sm text-center">
          팩트폭격기에게 맞더라도 당황하거나, 흥분하시면 안됩니다.
          <br />
          @Fact Machine V1.1
        </div>
      </div>
    </>
  );
};

export default ChatWindow;