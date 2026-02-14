import { query } from "@/lib/db";
import crypto from "crypto";
import { pusher } from "@/lib/pusher";

export async function POST(req) {
  try {
    const { pollId, optionId, voterId } = await req.json();

    if (!pollId || !optionId || !voterId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash voter ID
    const voterHash = crypto
      .createHash("sha256")
      .update(voterId)
      .digest("hex");

    // Insert vote (DB enforces uniqueness)
    await query(
      `
      INSERT INTO votes (poll_id, option_id, voter_hash)
      VALUES ($1, $2, $3)
      `,
      [pollId, optionId, voterHash]
    );

    await pusher.trigger(
      `poll-${pollId}`,
      "vote-updated",
      { pollId }
    );

    return Response.json({ success: true });

  } catch (err) {
    // Duplicate vote attempt
    if (err.code === "23505") {
      return Response.json(
        { error: "You have already voted" },
        { status: 409 }
      );
    }

    console.error(err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
