"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  function updateOption(value, index) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  function removeOption(index) {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  }

  async function createPoll() {
    setLoading(true);
    const filtered = options.filter((o) => o.trim() !== "");
    if (!question || filtered.length < 2) {
      alert("Please enter a question and at least 2 valid options.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options: filtered }),
      });

      const data = await res.json();
      if (res.ok) router.push(`/poll/${data.pollId}`);
      else alert(data.error);
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="bg-linear-to-r from-gray-600 to-gray-800 p-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create a Poll
          </h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Your Question
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-gray-500 transition-all"
                placeholder="What do you want to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Options
            </label>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center group">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium text-xs">
                    {i + 1}.
                  </div>
                  <input
                    className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-gray-500 transition-all shadow-sm text-gray-700"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(e.target.value, i)}
                  />
                </div>
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addOption}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add another option
          </button>

          <div className="pt-2">
            <button
              onClick={createPoll}
              disabled={loading}
              className="w-full bg-linear-to-r from-gray-600 to-gray-800 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Launch Poll"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}