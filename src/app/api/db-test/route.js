import { query } from "@/lib/db";

export async function GET() {
  const result = await query("SELECT NOW()");
  return Response.json({ time: result.rows[0] });
}
