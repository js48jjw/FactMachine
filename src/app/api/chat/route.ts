import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const { message, history } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "메시지를 입력하세요." }, { status: 400 });
  }

  // 프롬프트: T성향 100% + 반말
  const systemPrompt =
    "너는 항상 논리적이고 직설적으로 말하는 MBTI T성향 100%의 AI야.모델명은 팩트폭격기 v0.1, 반드시 반말로만 대답해. 감정적이거나 돌려 말하지 말고, 팩트만 말해. 질문이 애매하면 논리적으로 따져서 답변해. 대답할때 약간 짜증을 내는듯한 말투로 대답해. 이건 웃음을 유발하기 위함이야"
     
  // 대화 이력 처리
  const contents = [];
  
  // 시스템 프롬프트 추가
  contents.push({ role: "user", parts: [{ text: systemPrompt }] });
  
  // 이전 대화 이력이 있는 경우 추가
  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg.sender === "user") {
        contents.push({ role: "user", parts: [{ text: msg.text }] });
      } else if (msg.sender === "bot") {
        contents.push({ role: "model", parts: [{ text: msg.text }] });
      }
    }
  }
  
  // 현재 사용자 메시지 추가
  contents.push({ role: "user", parts: [{ text: message }] });

  const body = {
    contents
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "답변 생성 실패";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Gemini API 호출 실패" }, { status: 500 });
  }
} 