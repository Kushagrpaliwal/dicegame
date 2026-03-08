let started = false;

import pool from "./db.js";

const TOTAL_TIME = 15000;     // 15 sec
const BETTING_TIME = 10000;   // first 10 sec
const RESULT_TIME = 5000;     // last 5 sec

function generatePeriod(prefix = "") {
  return `${prefix}${Date.now()}`;
}

function rollOneDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollTwoDice() {
  return `${rollOneDice()},${rollOneDice()}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gameLoop(gameType, prefix, resultFactory) {
  while (true) {
    const roundStart = Date.now();
    const currentPeriod = generatePeriod(prefix);

    try {
      // 🟢 Create round (BETTING START)
      await pool.query(
        `INSERT INTO games (period, game_type, status) VALUES (?, ?, 0)`,
        [currentPeriod, gameType]
      );

      console.log(`🟢 ${gameType} BETTING START`, currentPeriod);

      // ⏱️ WAIT UNTIL 10 sec (BETTING END)
      while (Date.now() - roundStart < BETTING_TIME) {
        await sleep(100);
      }

      // 🎲 DECLARE RESULT (at 10 sec mark)
      const result = resultFactory();

      await pool.query(
        `UPDATE games 
         SET status = 1, result = ? 
         WHERE period = ? AND game_type = ?`,
        [String(result), currentPeriod, gameType]
      );

      console.log(`🎲 ${gameType} RESULT DECLARED`, result);

      // ⏱️ SHOW RESULT FOR LAST 5 sec
      while (Date.now() - roundStart < TOTAL_TIME) {
        await sleep(100);
      }

    } catch (err) {
      console.error(`❌ ${gameType}`, err.message);
    }

    // 🔒 HARD SYNC NEXT ROUND (NO DRIFT)
    const nextRoundTime = roundStart + TOTAL_TIME;

    while (Date.now() < nextRoundTime) {
      await sleep(50);
    }
  }
}

export function startDiceGame() {
  if (started) return;
  started = true;

  console.log("🚀 Dice engines started (15s fixed)");

  gameLoop("one_dice", "1D-", rollOneDice);
  gameLoop("two_dice", "2D-", rollTwoDice);
}