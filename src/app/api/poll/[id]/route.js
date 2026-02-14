import { query } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id: pollId } = await params;

    // Fetch poll
    const pollResult = await query(
      "SELECT id, question FROM polls WHERE id = $1",
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return Response.json({ error: "Poll not found" }, { status: 404 });
    }

    // Fetch options with vote counts
    const optionsResult = await query(
      `
      SELECT 
        o.id,
        o.text,
        COUNT(v.id) AS votes
      FROM options o
      LEFT JOIN votes v ON o.id = v.option_id
      WHERE o.poll_id = $1
      GROUP BY o.id
      ORDER BY o.text
      `,
      [pollId]
    );

    return Response.json({
      id: pollResult.rows[0].id,
      question: pollResult.rows[0].question,
      options: optionsResult.rows,
    });

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
