import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

// Define the API route for handling file uploads over POST
export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the multipart form data
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

    // Generate unique secure filename
    const ext = file.name.split('.').pop();
    const uniqueName = `nodearchive-${Date.now()}.${ext}`;
    
    // Resolve upload directory (Save to public so it's statically served)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, uniqueName);
    
    // Write binary down to disk
    await fs.writeFile(filePath, buffer);

    // Return the relative URL string that can be stored in the CMS
    return new Response(JSON.stringify({ url: `/uploads/${uniqueName}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('File compilation error:', err);
    return new Response(JSON.stringify({ error: 'System error during file processing' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
