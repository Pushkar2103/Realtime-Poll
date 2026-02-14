"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  function updateOption(value, index) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  async function createPoll() {
    const filtered = options.filter(o => o.trim() !== "");

    const res = await fetch("/api/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        options: filtered
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/poll/${data.pollId}`);
    } else {
      alert(data.error || "Failed to create poll");
    }
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Create a Poll</h1>

      <input
        placeholder="Poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => updateOption(e.target.value, i)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      ))}

      <button onClick={addOption}>+ Add Option</button>
      <br /><br />
      <button onClick={createPoll}>Create Poll</button>
    </main>
  );
}
