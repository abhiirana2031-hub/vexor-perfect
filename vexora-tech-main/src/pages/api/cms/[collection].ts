import type { APIRoute } from 'astro';
import { getMongoDb } from '@/lib/db/mongo';

export const GET: APIRoute = async ({ params, request }) => {
  const collection = params.collection;
  if (!collection) return new Response(JSON.stringify({ error: "Missing collection" }), { status: 400 });
  
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const skip = parseInt(url.searchParams.get('skip') || '0');

  try {
    const db = await getMongoDb();
    
    // Build filter
    const filter: any = {};
    const isFeatured = url.searchParams.get('isFeatured');
    if (isFeatured !== null) {
      filter.isFeatured = isFeatured === 'true';
    }

    const items = await db.collection(collection).find(filter).skip(skip).limit(limit).toArray();
    const totalCount = await db.collection(collection).countDocuments(filter);

    return new Response(JSON.stringify({
      items,
      totalCount,
      hasNext: skip + items.length < totalCount,
      currentPage: Math.floor(skip / limit),
      pageSize: limit,
      nextSkip: skip + items.length < totalCount ? skip + limit : null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const collection = params.collection;
  if (!collection) return new Response(JSON.stringify({ error: "Missing collection" }), { status: 400 });
  
  try {
    const db = await getMongoDb();
    const data = await request.json();
    if (!data._id) {
        data._id = crypto.randomUUID();
    }
    await db.collection(collection).insertOne(data);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
