import { a as assertAllowedCollection, g as getMongoDb, s as serializeDocument } from '../../../chunks/serialize_DOiYo3-Q.mjs';
import { randomUUID } from 'node:crypto';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params, url }) => {
  const collection = params.collection ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const limit = Math.min(
    Math.max(1, Number(url.searchParams.get("limit")) || 50),
    1e3
  );
  const skip = Math.max(0, Number(url.searchParams.get("skip")) || 0);
  try {
    const db = await getMongoDb();
    const coll = db.collection(collection);
    const [items, totalCount] = await Promise.all([
      coll.find({}).skip(skip).limit(limit).toArray(),
      coll.countDocuments({})
    ]);
    const hasNext = skip + limit < totalCount;
    return new Response(
      JSON.stringify({
        items: items.map((d) => serializeDocument(d)),
        totalCount,
        hasNext,
        currentPage: Math.floor(skip / limit),
        pageSize: limit,
        nextSkip: hasNext ? skip + limit : null
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ params, request }) => {
  const collection = params.collection ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const _id = typeof body._id === "string" ? body._id : randomUUID();
  const now = /* @__PURE__ */ new Date();
  const doc = {
    ...body,
    _id,
    _createdDate: body._createdDate ? new Date(String(body._createdDate)) : now,
    _updatedDate: now
  };
  try {
    const db = await getMongoDb();
    const coll = db.collection(collection);
    await coll.insertOne(doc);
    return new Response(JSON.stringify(serializeDocument(doc)), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
