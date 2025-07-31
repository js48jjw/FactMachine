'use client';

import React, { useState, useEffect, useCallback } from "react";
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

  const { isListening, transcript, setTranscript, startListening, stopListening, speak } = useVoice();

  const resetConversation = () => {
    setMessages([]);
    setMsgId(0);
    setFeedback({});
    stopListening();
    setVoiceMode(false);
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
  }, [messages, msgId]);

  useEffect(() => {
    if (transcript && !loading) {
      handleSend(transcript);
      setTranscript("");
    }
  }, [transcript, handleSend, loading, setTranscript]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "bot") {
      const botMessage = messages[messages.length - 1].text;
      // 마크다운 제거
      const textToSpeak = botMessage.replace(/(\*\*|\*|_|`|~|#)/g, "");
      if (voiceMode) {
        speak(textToSpeak, () => {
          if (voiceMode) {
            startListening();
          }
        });
      }
    }
  }, [messages, voiceMode, speak, startListening]);

  const handleVoiceInput = () => {
    const newVoiceMode = !voiceMode;
    setVoiceMode(newVoiceMode);
    if (newVoiceMode) {
      startListening();
    } else {
      stopListening();
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