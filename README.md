# 팩트폭격기 (Fact Machine)

논리적이고 직설적인 AI 챗봇, "팩트폭격기"!

- MBTI T성향 100%의 AI가 반말로 팩트만 말해줍니다.
- 감정 없이 논리적으로, 때론 짜증 섞인 말투로 대답합니다.
- Next.js 기반, Gemini API 연동

## 주요 기능
- 실시간 대화형 챗봇 UI
- Gemini API를 통한 자연어 답변 생성
- 답변 생성 중 로딩(스피너) 표시
- 답변 복사, 좋아요/싫어요 피드백
- 음성모드(마이크) 지원 (옵션)

## 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 환경 변수
- 프로젝트를 Vercel 등의 호스팅 서비스에 배포할 경우, 서비스의 환경 변수 설정 메뉴에서 `GEMINI_API_KEY`를 직접 추가해야 합니다.
- 로컬에서 개발할 경우에만, 프로젝트 루트에 `.env.local` 파일을 생성하고 아래와 같이 키를 설정하세요.

```
GEMINI_API_KEY=your_google_gemini_api_key
```

## 폴더 구조
- `src/app/page.tsx` : 메인 챗봇 UI
- `src/app/api/chat/route.ts` : Gemini API 연동 백엔드
- `src/components/ui/Spinner.tsx` : 로딩 스피너

## 라이선스
MIT
