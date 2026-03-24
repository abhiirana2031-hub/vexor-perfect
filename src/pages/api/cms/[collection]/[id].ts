import type { APIRoute } from "astro";
import { getMongoDb } from "@/lib/db/mongo";
import { assertAllowedCollection } from "@/lib/db/collections";
import type { CmsDoc } from "@/lib/db/cms-doc";
import { serializeDocument } from "@/lib/db/serialize";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const collection = params.collection ?? "";
  const id = params.id ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = await getMongoDb();
    const doc = await db.collection<CmsDoc>(collection).findOne({ _id: id });
    if (!doc) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(serializeDocument(doc)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const collection = params.collection ?? "";
  const id = params.id ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let patch: Record<string, unknown>;
  try {
    patch = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  delete patch._id;

  const set: Record<string, unknown> = { ...patch, _updatedDate: new Date() };
  for (const key of Object.keys(set)) {
    const v = set[key];
    if (
      typeof v === "string" &&
      (key.endsWith("Date") || key === "completionDate" || key === "datePosted")
    ) {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) set[key] = d;
    }
  }

  try {
    const db = await getMongoDb();
    const coll = db.collection<CmsDoc>(collection);
    const prev = await coll.findOne({ _id: id });
    if (!prev) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await coll.updateOne({ _id: id }, { $set: set });
    const next: CmsDoc = { ...prev, ...set, _id: id };
    return new Response(JSON.stringify(serializeDocument(next)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const collection = params.collection ?? "";
  const id = params.id ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = await getMongoDb();
    const coll = db.collection<CmsDoc>(collection);
    const prev = await coll.findOne({ _id: id });
    if (!prev) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await coll.deleteOne({ _id: id });
    return new Response(JSON.stringify(serializeDocument(prev)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
