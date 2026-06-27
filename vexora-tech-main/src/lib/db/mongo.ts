import { MongoClient } from "mongodb";

function mongoUri(): string | undefined {
  const fromVite = import.meta.env.MONGODB_URI?.trim();
  if (fromVite) return fromVite;
  if (typeof process !== "undefined" && process.env.MONGODB_URI?.trim()) {
    return process.env.MONGODB_URI.trim();
  }
  return undefined;
}

function mongoDbName(): string {
  const fromVite = import.meta.env.MONGODB_DB_NAME?.trim();
  if (fromVite) return fromVite;
  if (typeof process !== "undefined" && process.env.MONGODB_DB_NAME?.trim()) {
    return process.env.MONGODB_DB_NAME.trim();
  }
  return "vexora";
}

let client: MongoClient | undefined;

export function getMongoUri(): string {
  const uri = mongoUri();
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Add it to a .env file (see .env.example).",
    );
  }
  return uri;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(getMongoUri());
    await client.connect();
  }
  return client;
}

export async function getMongoDb() {
  const c = await getMongoClient();
  return c.db(mongoDbName());
}
