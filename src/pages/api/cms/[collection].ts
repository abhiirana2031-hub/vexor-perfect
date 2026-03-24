import type { APIRoute } from "astro";
import { getMongoDb } from "@/lib/db/mongo";
import { assertAllowedCollection } from "@/lib/db/collections";
import type { CmsDoc } from "@/lib/db/cms-doc";
import { serializeDocument } from "@/lib/db/serialize";
import { randomUUID } from "node:crypto";

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const collection = params.collection ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const limit = Math.min(
    Math.max(1, Number(url.searchParams.get("limit")) || 50),
    1000,
  );
  const skip = Math.max(0, Number(url.searchParams.get("skip")) || 0);

  try {
    const db = await getMongoDb();
    const coll = db.collection<CmsDoc>(collection);
    const [items, totalCount] = await Promise.all([
      coll.find({}).skip(skip).limit(limit).toArray(),
      coll.countDocuments({}),
    ]);
    const hasNext = skip + limit < totalCount;

    return new Response(
      JSON.stringify({
        items: items.map((d) => serializeDocument(d)),
        totalCount,
        hasNext,
        currentPage: Math.floor(skip / limit),
        pageSize: limit,
        nextSkip: hasNext ? skip + limit : null,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const collection = params.collection ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const _id = typeof body._id === "string" ? body._id : randomUUID();
  const now = new Date();
  const doc: CmsDoc = {
    ...body,
    _id,
    _createdDate: body._createdDate ? new Date(String(body._createdDate)) : now,
    _updatedDate: now,
  };

  try {
    const db = await getMongoDb();
    const coll = db.collection<CmsDoc>(collection);
    await coll.insertOne(doc);
    return new Response(JSON.stringify(serializeDocument(doc)), {
      status: 201,
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
