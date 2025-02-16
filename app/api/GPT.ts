import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ message: "Invalid prompt" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    if (!response.choices || response.choices.length === 0) {
      return NextResponse.json({ message: "No response from OpenAI" }, { status: 500 });
    }

    return NextResponse.json({ result: response.choices[0].message.content }, { status: 200 });

  } catch (error: any) {
    console.error("OpenAI API Error:", error); // 로그 추가
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
