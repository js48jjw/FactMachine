'use client';

import React, { useState, useEffect, useRef } from "react";
import TitleHeader from "../components/TitleHeader";
import MessageInput from "../components/MessageInput";
import { useVoice } from "../hooks/useVoice";
import Spinner from "../components/ui/Spinner";

// 메시지 타입 명확히 지정
interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function HomePage() {
  // started, setStarted 제거
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgId, setMsgId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  // 대화 이력 초기화 함수
  const resetConversation = () => {
    setMessages([]);
    setMsgId(0);
    setFeedback({});
  };
  // 음성모드 훅
  const { transcript, setTranscript, speak } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // 각 메시지별 좋아요/싫어요 상태 관리
  const [feedback, setFeedback] = useState<Record<number, "like" | "dislike" | null>>({});
  const [copyNotice, setCopyNotice] = useState(false);

  // 음성 인식 결과가 나오면 자동 전송
  useEffect(() => {
    if (transcript && !loading) {
      handleSend(transcript);
      setTranscript("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Gemini 답변이 오면 음성모드가 켜져 있을 때만 TTS 실행
  useEffect(() => {
    if (
      voiceMode &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "bot"
    ) {
      speak(messages[messages.length - 1].text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, voiceMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gemini API 연동
  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = { id: msgId, text, sender: "user" };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setMsgId(id => id + 1);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: newMessages })
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: msgId + 1,
        text: data.text || "답변 생성 실패",
        sender: "bot"
      };
      setMessages(prev => [...prev, botMsg]);
      setMsgId(id => id + 1);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: msgId + 1, text: "답변 생성 중 오류가 발생했어.", sender: "bot" as const }
      ]);
      setMsgId(id => id + 1);
    } finally {
      setLoading(false);
    }
  };

  // 음성모드 버튼 클릭 핸들러 (토글)
  const handleVoiceInput = () => {
    setVoiceMode((prev) => !prev);
  };

  // 좋아요/싫어요 토글 핸들러
  const handleLike = (id: number) => {
    setFeedback(prev => ({ ...prev, [id]: prev[id] === "like" ? null : "like" }));
  };
  const handleDislike = (id: number) => {
    setFeedback(prev => ({ ...prev, [id]: prev[id] === "dislike" ? null : "dislike" }));
  };
  // 복사 핸들러
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start">
      {/* 상단 타이틀 */}
      <div className="w-full flex flex-col items-center mt-12 mb-8">
        <TitleHeader />
      </div>
      {/* 대화 메시지 리스트 (Grok 스타일) */}
      <div className="flex flex-col gap-10 w-full max-w-2xl mx-auto mt-4 mb-20 pb-24">
        {messages.length === 0 ? (
          <div className="flex flex-1 min-h-[40vh] items-center justify-center">
            <span className="text-center text-gray-400 text-xl">대화를 시작해보세요!</span>
          </div>
        ) : (
          messages.map(msg =>
            msg.sender === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xl w-fit text-base text-gray-800 bg-transparent p-0">
                  <div className="text-right text-gray-400 text-xs mb-1">나</div>
                  <div className="font-medium break-words whitespace-pre-line">{msg.text}</div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-xl w-fit text-[17px] text-gray-900 bg-transparent p-0">
                  <div className="text-left text-purple-600 text-xs mb-1">팩트폭격기</div>
                  <div className="font-semibold break-words whitespace-pre-line">{msg.text}</div>
                  {/* 액션 아이콘 자리 */}
                  <div className="flex gap-4 mt-2 text-base select-none">
                    <div className="flex gap-1">
                      <button
                        title="좋아요"
                        onClick={() => handleLike(msg.id)}
                        className={`transition transform hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center
                          ${feedback[msg.id] === "like"
                            ? "bg-yellow-100 text-yellow-600 ring-2 ring-yellow-200 scale-110"
                            : "bg-transparent text-gray-400"}
                        `}
                      >👍</button>
                      <button
                        title="싫어요"
                        onClick={() => handleDislike(msg.id)}
                        className={`transition transform hover:scale-110 rounded-full w-10 h-10 flex items-center justify-center
                          ${feedback[msg.id] === "dislike"
                            ? "bg-yellow-100 text-yellow-600 ring-2 ring-yellow-200 scale-110"
                            : "bg-transparent text-gray-400"}
                        `}
                      >👎</button>
                    </div>
                    <button
                      title="복사"
                      onClick={() => handleCopy(msg.text)}
                      className="hover:scale-110 transition text-gray-400"
                    >📋</button>
                  </div>
                </div>
              </div>
            )
          )
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
        <div className="w-full bg-white rounded-3xl shadow-xl px-8 py-5 flex flex-col items-center">
          {/* 입력창+음성모드 버튼 한 줄에 배치 */}
          <div className="w-full flex items-center gap-2">
<<<<<<< HEAD
            <button
              className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm border bg-gray-200 transition hover:bg-gray-300"
              onClick={resetConversation}
              type="button"
              title="새로운 대화"
            >
              <span className="text-xl font-bold text-gray-700">+</span>
            </button>
=======
>>>>>>> 40b0fed419a732635431e766346acd7c2a963719
            <div className="flex-1">
              <MessageInput onSend={handleSend} disabled={loading} />
            </div>
            <button
              className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm border transition
                ${voiceMode ? "bg-purple-600" : "bg-black"}`}
              onClick={handleVoiceInput}
              type="button"
              title="음성모드"
            >
              {/* 마이크/음성 아이콘 (SVG) */}
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
        {/* 하단 안내문구 */}
        <div className="mt-4 text-gray-400 text-sm text-center">
          팩트폭격기에게 맞더라도 당황하거나, 흥분하시면 안됩니다.<br />
          @Fact Machine V0.1
        </div>
      </div>
    </main>
  );
}
