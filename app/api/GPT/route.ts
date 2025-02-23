import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "프롬프트를 입력하세요." }, { status: 400 });
    }

    const systemMessage = `
      너는 프롬프트 엔지니어링 전문가야.
      사용자의 입력을 분석해서 더 효과적인 프롬프트로 변환해줘.

      변환 기준:
      1. 역할(Role) 부여하기
      2. 명확한 질문 형식 만들기
      3. 출력 형식 지정하기 (필요할 경우)
      4. 예제 포함하기 (필요할 경우)

      사용자 입력이 애매하면 구체적인 설명을 추가해줘.
    `;

    const proptEngineering = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await proptEngineering.json();

    if (!proptEngineering.ok) {
      return NextResponse.json({ error: "OpenAI API 요청 실패" }, { status: 500 });
    }
    //prompt enginering
    

    const promptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "user", content: data.choices[0].message.content},
        ],
        temperature: 0.7,
      }),
    });

    const resData = await promptResponse.json();
    if(!promptResponse.ok){ return NextResponse.json({error: "failed to request to openai"},{status:500})}

    return NextResponse.json({modelResponse: resData.chocies[0].message.content},{status:200});
  } catch (error) {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
