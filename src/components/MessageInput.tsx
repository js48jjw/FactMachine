import React, { useRef, useEffect, useState } from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // 초기 로드 시 한 번 실행
    window.addEventListener('resize', checkMobile); // 창 크기 변경 시마다 실행

    return () => {
      window.removeEventListener('resize', checkMobile); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
      onChange("");
    }
  };

  useEffect(() => {
    if (!disabled && !isMobile) {
      textareaRef.current?.focus();
    }
  }, [disabled, isMobile]);

  const placeholderText = isMobile ? "메시지 입력..." : "메시지를 입력하세요...";

  return (
    <div className="flex w-full items-center gap-2">
      <textarea
        ref={textareaRef}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none min-h-[44px] max-h-40 text-base"
        placeholder={placeholderText}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        autoFocus={typeof window !== 'undefined' && window.innerWidth > 768}
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