import { getPool } from "../../../lib/db";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ success: false, message: "username is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      event_id,
      event_name,
      market_id,
      market_name,
      market_type,
      sportName = "Cricket",
      match_type,
      betType,
      runnerName,
      oddName,
      odds,
      size,
      stake,
      runnerId,
    } = body;

    if (!match_type || !betType || !runnerName || !odds || !stake) {
      return Response.json({ success: false, message: "Missing required bet fields" }, { status: 400 });
    }

    const pool = getPool();
    console.log("addBets: Starting INSERT query...");
    const result = await pool.query(
      `INSERT INTO bets 
        (username, event_id, event_name, market_id, market_name, market_type, "sportName", match_type, "betType", "runnerName", "oddName", odds, size, stake, "runnerId")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id`,
      [
        username,
        event_id || null,
        event_name || null,
        market_id || null,
        market_name || null,
        market_type || null,
        sportName,
        match_type,
        betType,
        runnerName,
        oddName || null,
        parseFloat(odds),
        size ? parseFloat(size) : null,
        parseFloat(stake),
        runnerId || null,
      ]
    );
    console.log("addBets: INSERT successful, id:", result.rows[0].id);

    return Response.json({ success: true, betId: result.rows[0].id }, { status: 201 });
  } catch (err) {
    console.error("addBets error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
