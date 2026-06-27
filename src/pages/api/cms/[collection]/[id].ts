import type { APIRoute } from 'astro';
import { getMongoDb } from '@/lib/db/mongo';

export const GET: APIRoute = async ({ params }) => {
  const { collection, id } = params;
  if (!collection || !id) return new Response(null, { status: 400 });
  
  try {
    const db = await getMongoDb();
    
    // Try to handle ObjectId if it's a valid hex string, otherwise use string id
    let queryId: any = id;
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        try {
            const { ObjectId } = await import('mongodb');
            queryId = new ObjectId(id);
        } catch (e) {
            queryId = id;
        }
    }

    const item = await db.collection(collection).findOne({ _id: queryId });
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
    
    // Try to handle ObjectId if it's a valid hex string, otherwise use string id
    let queryId: any = id;
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        try {
            const { ObjectId } = await import('mongodb');
            queryId = new ObjectId(id);
        } catch (e) {
            queryId = id;
        }
    }

    // Remove _id from updates so we don't accidentally try to modify it
    const updateData = { ...data };
    delete updateData._id;

    await db.collection(collection).updateOne({ _id: queryId }, { $set: updateData });
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

    // Try to handle ObjectId if it's a valid hex string, otherwise use string id
    let queryId: any = id;
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        try {
            const { ObjectId } = await import('mongodb');
            queryId = new ObjectId(id);
        } catch (e) {
            queryId = id;
        }
    }

    await db.collection(collection).deleteOne({ _id: queryId });
    return new Response(JSON.stringify({ success: true, _id: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
