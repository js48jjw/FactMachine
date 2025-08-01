'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
import TitleHeader from "../components/TitleHeader";
import ChatWindow from "../components/ChatWindow";
import { useVoice } from "../hooks/useVoice";
import type { Message } from "../components/ChatWindow";

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgId, setMsgId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, "like" | "dislike" | null>>({});
  const [copyNotice, setCopyNotice] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isBotSpeaking, setIsBotSpeaking] = useState(false); // 봇이 말하고 있는지 여부

  const lastSpokenMessageId = useRef<number | null>(null);

  const { isListening, transcript, setTranscript, startListening, stopListening, speak, stopSpeaking } = useVoice();

  const resetConversation = () => {
    setMessages([]);
    setMsgId(0);
    setFeedback({});
    stopListening();
    stopSpeaking(); // 음성 모드 초기화 시 음성 합성 중단
    setVoiceMode(false);
    setIsBotSpeaking(false); // 봇 말하기 상태 초기화
    lastSpokenMessageId.current = null; // 대화 초기화 시 마지막 음성 메시지 ID도 초기화
  };

  const handleSend = useCallback(async (text: string) => {
    if (text.trim() === "") return;

    const userMsg: Message = { id: msgId, text, sender: "user" };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setMsgId(id => id + 2);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: newMessages.slice(0, -1) }), // 현재 메시지는 제외하고 전송
      });
      const data = await res.json();
      const botMsg: Message = {
        id: msgId + 1,
        text: data.text || "답변 생성 실패",
        sender: "bot",
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: msgId + 1,
        text: "답변 생성 중 오류가 발생했어.",
        sender: "bot",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [messages, msgId]); // stopSpeaking 추가

  useEffect(() => {
    if (transcript && !loading) {
      handleSend(transcript);
      setTranscript("");
    }
  }, [transcript, handleSend, loading, setTranscript]);

  // 사용자가 말을 멈췄을 때 (마이크가 꺼졌을 때) 자동으로 다시 시작
  useEffect(() => {
    if (voiceMode && !isListening && !loading && !isBotSpeaking) {
      const timeoutId = setTimeout(() => {
        startListening();
      }, 100); // 짧은 지연 후 다시 시작

      return () => clearTimeout(timeoutId); // 클린업
    }
  }, [voiceMode, isListening, loading, isBotSpeaking, startListening]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "bot") {
      const currentBotMessage = messages[messages.length - 1];
      if (currentBotMessage.id === lastSpokenMessageId.current) {
        // 이 메시지는 이미 음성으로 출력되었으므로 다시 출력하지 않음
        return;
      }

      const botMessageText = currentBotMessage.text;
      // 마크다운 제거
      const textToSpeak = botMessageText.replace(/(\*\*|\*|_|`|~|#)/g, "");
      console.log("Voice mode status before speaking:", voiceMode);
      if (voiceMode) {
        setIsBotSpeaking(true); // 봇이 말하기 시작
        speak(textToSpeak, () => {
          if (voiceMode) {
            setTimeout(() => {
              startListening();
            }, 500); // 0.5초 지연
          }
          setIsBotSpeaking(false); // 봇이 말하기 종료
        });
        lastSpokenMessageId.current = currentBotMessage.id; // 현재 메시지를 마지막으로 음성 출력된 메시지로 기록
      }
    }
  }, [messages, voiceMode, speak, startListening, setIsBotSpeaking, isBotSpeaking]);

  const handleVoiceInput = () => {
    const newVoiceMode = !voiceMode;
    setVoiceMode(newVoiceMode);
    if (newVoiceMode) {
      startListening();
    } else {
      stopListening();
      stopSpeaking(); // 음성 모드 비활성화 시 음성 합성 중단
    }
  };

  const handleLike = (id: number) => {
    setFeedback(prev => ({ ...prev, [id]: prev[id] === "like" ? null : "like" }));
  };

  const handleDislike = (id: number) => {
    setFeedback(prev => ({ ...prev, [id]: prev[id] === "dislike" ? null : "dislike" }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start">
      <div className="w-full flex flex-col items-center mt-12 mb-8">
      <TitleHeader />
      </div>
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        loading={loading}
        onVoiceInput={handleVoiceInput}
        isListening={isListening}
        voiceMode={voiceMode}
        resetConversation={resetConversation}
        feedback={feedback}
        onLike={handleLike}
        onDislike={handleDislike}
        onCopy={handleCopy}
        copyNotice={copyNotice}
        inputValue={inputValue}
        onInputChange={setInputValue}
      />
    </main>
  );
}