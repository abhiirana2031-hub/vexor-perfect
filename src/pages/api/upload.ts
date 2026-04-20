import type { APIRoute } from 'astro';
import { getMongoDb } from '@/lib/db/mongo';
import { Binary } from 'mongodb';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No valid file found in request' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert Web API File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get DB and Collection
    const db = await getMongoDb();
    const collection = db.collection('app_uploads');

    // Prepare document
    const fileId = crypto.randomUUID();
    const uploadDoc = {
      _id: fileId,
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      data: new Binary(buffer),
      size: file.size,
      uploadedAt: new Date(),
    };

    // Save to MongoDB
    await collection.insertOne(uploadDoc);

    // Return the relative URL string that points to our new serve route
    return new Response(JSON.stringify({ url: `/api/files/${fileId}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('File storage error:', err);
    return new Response(JSON.stringify({ error: 'System error during file processing' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
