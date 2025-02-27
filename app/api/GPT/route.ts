import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "대화 히스토리가 필요합니다." }, { status: 400 });
    }
    const systemMessage = {
      role: "system",
      content: `
        너는 프롬프트 엔지니어링 전문가야.
        사용자의 입력을 분석해서 더 효과적인 프롬프트로 변환해줘.

        변환 기준:
        1. 역할(Role) 부여하기
        2. 명확한 질문 형식 만들기
        3. 출력 형식 지정하기 (필요할 경우)
        4. 예제 포함하기 (필요할 경우)

        사용자 입력이 애매하면 구체적인 설명을 추가해줘.

      `,
    };

    // 프롬프트 엔지니어링 실행
    const promptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [systemMessage, messages[messages.length - 1]],
        temperature: 0.7,
      }),
    });

    if (!promptResponse.ok) {
      return NextResponse.json({ error: "프롬프트 엔지니어링 실패" }, { status: 500 });
    }

    const promptData = await promptResponse.json();
    const promptRep = promptData.choices?.[0]?.message?.content;

    if (!promptRep) {
      return NextResponse.json({ error: "프롬프트 변환 실패" }, { status: 500 });
    }

    const updatedMessages = [...messages.slice(0, -1), { role: "user", content: promptRep }];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [...updatedMessages],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "OpenAI API 요청 실패" }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json({ error: "GPT 응답 생성 실패" }, { status: 500 });
    }

    return NextResponse.json({ success: true, reply, raw: data }, { status: 200 });
  } catch (error) {
    console.error("서버 오류:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
