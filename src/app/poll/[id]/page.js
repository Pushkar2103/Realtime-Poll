"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";
import { getVoterId } from "@/lib/voter";

export default function PollPage() {
  const { id: pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  async function fetchPoll() {
    if (!pollId) return;
    const res = await fetch(`/api/poll/${pollId}`);
    const data = await res.json();
    setPoll(data);
    setLoading(false);
  }

  async function vote(optionId) {
    const voterId = getVoterId();

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pollId,
        optionId,
        voterId,
      }),
    });

    if (res.ok) {
      setVoted(true);
      fetchPoll();
    } else {
      const data = await res.json();
      alert(data.error || "Voting failed");
      setVoted(true);
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  // Real-time updates
  useEffect(() => {
    if (!pollId) return;

    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      }
    );

    const channel = pusher.subscribe(`poll-${pollId}`);

    channel.bind("vote-updated", () => {
      fetchPoll();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [pollId]);

  if (!pollId || loading) return <p>Loading...</p>;
  if (poll?.error) return <p>Poll not found</p>;

  return (
    <main style={{ padding: "40px" }}>
      <h1>{poll.question}</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {poll.options.map((opt) => (
          <li key={opt.id} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => vote(opt.id)}
              disabled={voted}
              style={{ marginRight: "10px" }}
            >
              Vote
            </button>
            {opt.text} — {opt.votes} votes
          </li>
        ))}
      </ul>

      {voted && <p>✅ You have voted</p>}
    </main>
  );
}
