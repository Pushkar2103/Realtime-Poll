import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { question, options } = body;

    // Basic validation
    if (!question || !Array.isArray(options) || options.length < 2) {
      return Response.json(
        { error: "Question and at least 2 options required" },
        { status: 400 }
      );
    }

    // Insert poll
    const pollResult = await query(
      "INSERT INTO polls (question) VALUES ($1) RETURNING id",
      [question]
    );

    const pollId = pollResult.rows[0].id;

    // Insert options
    for (const opt of options) {
      await query(
        "INSERT INTO options (poll_id, text) VALUES ($1, $2)",
        [pollId, opt]
      );
    }

    return Response.json({ pollId });

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
