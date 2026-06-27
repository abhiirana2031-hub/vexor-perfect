import type { APIRoute } from 'astro';
import { getMongoDb } from '@/lib/db/mongo';

export const GET: APIRoute = async () => {
  try {
    const db = await getMongoDb();
    const statsCollection = db.collection('sitestats') as any;
    
    // Try to get existing stats
    let stats = await statsCollection.findOne({ _id: 'main' });
    
    // If no stats exist, create default ones
    if (!stats) {
      const defaultStats = {
        _id: 'main',
        projectsCompleted: '500+',
        happyClients: '200+',
        teamMembers: '50+',
        yearsExperience: '15+',
        _createdDate: new Date(),
        _updatedDate: new Date()
      };
      await statsCollection.insertOne(defaultStats);
      stats = defaultStats;
    }

    return new Response(JSON.stringify(stats), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    if (!data.projectsCompleted || !data.happyClients || !data.teamMembers || !data.yearsExperience) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await getMongoDb();
    const statsCollection = db.collection('sitestats') as any;
    
    const updatedStats = {
      _id: 'main',
      projectsCompleted: data.projectsCompleted,
      happyClients: data.happyClients,
      teamMembers: data.teamMembers,
      yearsExperience: data.yearsExperience,
      _updatedDate: new Date()
    };

    await statsCollection.updateOne(
      { _id: 'main' },
      { 
        $set: updatedStats,
        $setOnInsert: { _createdDate: new Date() }
      },
      { upsert: true }
    );

    return new Response(JSON.stringify(updatedStats), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error updating stats:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
