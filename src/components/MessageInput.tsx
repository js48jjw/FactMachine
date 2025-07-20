import React, { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input);
    setInput("");
    // 포커스는 useEffect에서 처리
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // input이 비워지거나 disabled가 false가 될 때 포커스 유지
  useEffect(() => {
    if (input === "" && !disabled) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 30);
    }
  }, [input, disabled]);

  return (
    <div className="flex w-full gap-2 p-4 bg-white border-t">
      <textarea
        ref={inputRef}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none min-h-[44px] max-h-40 text-base"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />
      <button
        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
        onClick={handleSend}
        disabled={disabled}
      >
        전송
      </button>
    </div>
  );
};

export default MessageInput; 