import type { APIRoute } from 'astro';
import { getMongoDb } from '@/lib/db/mongo';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'File ID is required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = await getMongoDb();
    const collection = db.collection('app_uploads');

    const file = await collection.findOne({ _id: id });

    if (!file || !file.data) {
      return new Response(JSON.stringify({ error: 'File not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the binary data with the correct content type
    return new Response(file.data.buffer, {
      status: 200,
      headers: {
        'Content-Type': file.contentType || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': file.size?.toString() || file.data.buffer.length.toString()
      }
    });

  } catch (err) {
    console.error('File retrieval error:', err);
    return new Response(JSON.stringify({ error: 'System error during file retrieval' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
