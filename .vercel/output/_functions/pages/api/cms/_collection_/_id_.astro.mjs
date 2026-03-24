import { a as assertAllowedCollection, g as getMongoDb, s as serializeDocument } from '../../../../chunks/serialize_DOiYo3-Q.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  const collection = params.collection ?? "";
  const id = params.id ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const db = await getMongoDb();
    const doc = await db.collection(collection).findOne({ _id: id });
    if (!doc) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(serializeDocument(doc)), {
      status: 200,
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
const PATCH = async ({ params, request }) => {
  const collection = params.collection ?? "";
  const id = params.id ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let patch;
  try {
    patch = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  delete patch._id;
  const set = { ...patch, _updatedDate: /* @__PURE__ */ new Date() };
  for (const key of Object.keys(set)) {
    const v = set[key];
    if (typeof v === "string" && (key.endsWith("Date") || key === "completionDate" || key === "datePosted")) {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) set[key] = d;
    }
  }
  try {
    const db = await getMongoDb();
    const coll = db.collection(collection);
    const prev = await coll.findOne({ _id: id });
    if (!prev) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await coll.updateOne({ _id: id }, { $set: set });
    const next = { ...prev, ...set, _id: id };
    return new Response(JSON.stringify(serializeDocument(next)), {
      status: 200,
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
const DELETE = async ({ params }) => {
  const collection = params.collection ?? "";
  const id = params.id ?? "";
  try {
    assertAllowedCollection(collection);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid collection" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const db = await getMongoDb();
    const coll = db.collection(collection);
    const prev = await coll.findOne({ _id: id });
    if (!prev) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await coll.deleteOne({ _id: id });
    return new Response(JSON.stringify(serializeDocument(prev)), {
      status: 200,
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
  DELETE,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
