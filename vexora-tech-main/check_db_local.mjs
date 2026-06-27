import { MongoClient } from "mongodb";
import { readFileSync, existsSync } from "node:fs";

function loadDotEnv() {
  if (!existsSync(".env")) return;
  const raw = readFileSync(".env", "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "vexora";

if (!uri) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const cols = ["services", "projects", "teammembers", "testimonials"];
    const results = {};
    for (const c of cols) {
      results[c] = await db.collection(c).countDocuments();
    }
    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await client.close();
  }
}

run();
