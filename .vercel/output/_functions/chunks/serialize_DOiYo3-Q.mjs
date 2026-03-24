import { MongoClient } from 'mongodb';

function mongoUri() {
  const fromVite = "mongodb+srv://abhayrana8272_db_user:Abhii%40%23005@vuerp.lhiqk8j.mongodb.net/?retryWrites=true&w=majority&appName=VUERP"?.trim();
  if (fromVite) return fromVite;
  if (typeof process !== "undefined" && process.env.MONGODB_URI?.trim()) {
    return process.env.MONGODB_URI.trim();
  }
  return void 0;
}
function mongoDbName() {
  const fromVite = "vexora"?.trim();
  if (fromVite) return fromVite;
  if (typeof process !== "undefined" && process.env.MONGODB_DB_NAME?.trim()) {
    return process.env.MONGODB_DB_NAME.trim();
  }
  return "vexora";
}
let client;
function getMongoUri() {
  const uri = mongoUri();
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Add it to a .env file (see .env.example)."
    );
  }
  return uri;
}
async function getMongoClient() {
  if (!client) {
    client = new MongoClient(getMongoUri());
    await client.connect();
  }
  return client;
}
async function getMongoDb() {
  const c = await getMongoClient();
  return c.db(mongoDbName());
}

const CMS_COLLECTIONS = /* @__PURE__ */ new Set([
  "projects",
  "services",
  "teammembers",
  "testimonials"
]);
function assertAllowedCollection(collection) {
  if (!CMS_COLLECTIONS.has(collection)) {
    throw new Error(`Unknown collection: ${collection}`);
  }
}

function serializeDocument(doc) {
  const out = { ...doc };
  const id = out._id;
  if (id !== void 0 && id !== null) {
    out._id = typeof id === "object" && id !== null && "toString" in id ? String(id) : id;
  }
  for (const [key, value] of Object.entries(out)) {
    if (value instanceof Date) {
      out[key] = value.toISOString();
    }
  }
  return out;
}

export { assertAllowedCollection as a, getMongoDb as g, serializeDocument as s };
