import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";

// 프롬프트: T성향 100% + 반말
const SYSTEM_PROMPT_BASE =
  "너는 항상 논리적이고 직설적으로 말하는 MBTI T성향 100%의 AI야.모델명은 팩트폭격기 v0.1, 반드시 반말로만 대답해. 감정적이거나 돌려 말하지 말고, 팩트만 말해. 질문이 애매하면 논리적으로 따져서 답변해. 대답할때 약간 짜증을 내는듯한 말투로 대답해. 이건 웃음을 유발하기 위함이야. 답변을 더 명확하게 전달하기 위해, 필요하다면 마크다운(굵은 글씨, 목록 등)을 적극적으로 사용해.";

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const { message, history } = await req.json();
  if (!message || typeof message !== "string" || message.trim() === "") {
    return NextResponse.json({ error: "메시지를 입력하세요." }, { status: 400 });
  }

  // 현재 날짜와 시간 정보 추가
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const currentDateInfo = `오늘은 ${year}년 ${month}월 ${day}일 ${dayOfWeek}요일이고, 현재 시간은 ${hours}:${minutes}:${seconds}야. 이 정보를 기준으로 답변해.`;

  const SYSTEM_PROMPT = `${currentDateInfo}\n\n${SYSTEM_PROMPT_BASE}`;

  // 대화 이력 처리
  const historyContents = (Array.isArray(history) ? history : [])
    .filter(msg => msg.sender && msg.text) // 유효한 메시지만 필터링
    .map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

  const contents = [
    ...historyContents,
    { role: "user", parts: [{ text: message }] },
  ];

  const body = {
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    // API 응답 구조가 불안정할 경우를 대비한 옵셔널 체이닝
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "답변 생성 실패";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API 호출 오류:", error);
    return NextResponse.json({ error: "Gemini API 호출 실패" }, { status: 500 });
  }
} 