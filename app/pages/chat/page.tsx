"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/GPT", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Error: ${errorData.message}`);
      return;
    }

    const data = await res.json();
    setResponse(data.result);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>GPT Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요..."
        />
        <button type="submit">전송</button>
      </form>
      <div>
        <h2>응답:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}
