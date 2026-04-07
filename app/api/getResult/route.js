import { getPool } from "../../../lib/db";

export const dynamic = 'force-dynamic'; // Essential for cron jobs in Next.js

export async function GET(req) {
  try {
    const pool = getPool();
    
    // 1. Fetch all distinct pending markets from bets table
    const pendingQuery = `
      SELECT DISTINCT event_id, event_name, market_id, market_name
      FROM bets
      WHERE status = 'Pending'
    `;
    const pendingRes = await pool.query(pendingQuery);
    const pendingMarkets = pendingRes.rows;

    if (pendingMarkets.length === 0) {
      return Response.json({ success: true, message: "No pending bets to check." }, { status: 200 });
    }

    const apiKey = process.env.NEXT_PUBLIC_SPORTS_API_KEY;
    const results = [];

    // 2. Iterate through each pending market and check the external API
    for (const market of pendingMarkets) {
      try {
        const externalRes = await fetch(
          `http://130.250.191.212:3009/get-result?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_id: Number(market.event_id) || market.event_id,
              event_name: market.event_name,
              market_id: Number(market.market_id) || market.market_id,
              market_name: market.market_name,
            }),
          }
        );

        let data;
        const text = await externalRes.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error(`Invalid JSON from API for market ${market.market_id}:`, text);
          results.push({ market_id: market.market_id, action: "error", error: "Non-JSON response" });
          continue;
        }
        
        // 3. Update logic based on external response
        // If the match hasn't ended, simply skip and leave it Pending.
        if (externalRes.ok && data && (data.status === true || data.success === true)) {
          
          let winnerName = null;
          
          // --- BEGIN RESULT EXTRACTION LOGIC ---
          // Here we extract the winner's name from the JSON. 
          // (Adjust exactly to your API's winning field format!)
          if (typeof data.winner === 'string') {
            winnerName = data.winner;
          } else if (data.data && data.data[0] && typeof data.data[0].winner === 'string') {
            winnerName = data.data[0].winner;
          } else if (data.result && typeof data.result.winner === 'string') {
            winnerName = data.result.winner;
          }
          // --- END RESULT EXTRACTION LOGIC ---

          if (winnerName) {
            // Update the Won bets for this exact market and the matching runner!
            await pool.query(
              `UPDATE bets SET status = 'Won' WHERE market_id = $1 AND status = 'Pending' AND "runnerName" = $2`,
              [market.market_id, winnerName]
            );
            // Mark all other predictions for this market as Lost
            await pool.query(
              `UPDATE bets SET status = 'Lost' WHERE market_id = $1 AND status = 'Pending' AND "runnerName" != $2`,
              [market.market_id, winnerName]
            );
            results.push({ market_id: market.market_id, action: "updated", winner: winnerName, raw: data });
          } else {
             // API says success but we couldn't parse 'winner' string. Just log it.
             results.push({ market_id: market.market_id, action: "ignored_missing_winner", raw: data });
          }
        } else {
          // Match not ended or API returned unsuccessful response (e.g., 400 Bad Request)
          results.push({ market_id: market.market_id, action: "ignored_not_finished", raw: data });
        }
      } catch (err) {
        console.error(`Error checking market ${market.market_id}:`, err);
        results.push({ market_id: market.market_id, action: "error", error: err.message });
      }
    }

    return Response.json({ success: true, processed: pendingMarkets.length, results }, { status: 200 });
  } catch (err) {
    console.error("getResult cron error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
