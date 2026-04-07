import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables found:", res.rows.map(r => r.name));
    process.exit(0);
  } catch (err) {
    console.error("DB check failed:", err);
    process.exit(1);
  }
}
main();
