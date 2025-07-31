import React, { useRef, useEffect } from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
      onChange("");
    }
  };

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="flex w-full items-center gap-2">
      <textarea
        ref={textareaRef}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none min-h-[44px] max-h-40 text-base"
        placeholder="메시지를 입력하세요..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        autoFocus
      />
      <button
        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed"
        onClick={onSend}
        disabled={disabled || value.trim() === ""}
      >
        전송
      </button>
    </div>
  );
};

export default MessageInput;