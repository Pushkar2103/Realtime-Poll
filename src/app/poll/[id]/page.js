"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";
import { getVoterId } from "@/lib/voter";

export default function PollPage() {
  const { id: pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);

  async function fetchPoll() {
    const res = await fetch(`/api/poll/${pollId}`);
    const data = await res.json();
    setPoll(data);
  }

  async function vote(optionId) {
    const voterId = getVoterId();

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId, optionId, voterId }),
    });

    setVoted(true);
    fetchPoll();
  }

  useEffect(() => {
    if (!pollId) return;
    fetchPoll();

    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY,
      { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER }
    );

    const channel = pusher.subscribe(`poll-${pollId}`);
    channel.bind("vote-updated", fetchPoll);

    return () => {
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [pollId]);

  if (!poll) return <p className="p-6">Loading...</p>;

  const totalVotes = poll.options.reduce((s, o) => s + Number(o.votes), 0);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">{poll.question}</h1>
        </div>

        <div className="space-y-3">
          {poll.options.map((opt) => {
            const percent =
              totalVotes === 0
                ? 0
                : Math.round((opt.votes / totalVotes) * 100);

            return (
              <div key={opt.id}>
                <button
                  onClick={() => vote(opt.id)}
                  disabled={voted}
                  className={`w-full text-left border rounded-md p-2 mb-1
                    ${voted ? "bg-gray-100" : "hover:bg-gray-50"}
                  `}
                >
                  {opt.text}
                </button>

                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-gray-500 rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-xs text-gray-600 mt-1">
                  {opt.votes} votes ({percent}%)
                </div>
              </div>
            );
          })}
        </div>

        {voted && (
          <p className="text-sm text-gray-600 mt-4 text-center">
            You have voted!!
          </p>
        )}
      </div>
    </main>
  );
}
