import type { APIRoute } from 'astro';
import { getMongoDb } from '@/lib/db/mongo';

export const GET: APIRoute = async ({ params }) => {
  const { collection, id } = params;
  if (!collection || !id) return new Response(null, { status: 400 });
  
  try {
    const db = await getMongoDb();
    const item = await db.collection(collection).findOne({ _id: id });
    if (!item) return new Response(null, { status: 404 });
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { collection, id } = params;
  if (!collection || !id) return new Response(null, { status: 400 });
  
  try {
    const db = await getMongoDb();
    const data = await request.json();
    
    // Remove _id from updates so we don't accidentally try to modify it
    const updateData = { ...data };
    delete updateData._id;

    await db.collection(collection).updateOne({ _id: id }, { $set: updateData });
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { collection, id } = params;
  if (!collection || !id) return new Response(null, { status: 400 });
  
  try {
    const db = await getMongoDb();
    await db.collection(collection).deleteOne({ _id: id });
    return new Response(JSON.stringify({ success: true, _id: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
