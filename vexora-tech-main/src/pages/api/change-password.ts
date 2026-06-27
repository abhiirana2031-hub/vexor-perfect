import type { APIRoute } from 'astro';
import { getMongoDb } from '@/lib/db/mongo';
import crypto from 'crypto';

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { currentPassword, newPassword, email } = await request.json();

    if (!currentPassword || !newPassword || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters long' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const db = await getMongoDb();
      
      // For demo purposes, we store a users collection with hashed passwords
      // In production, integrate with your auth system (Netlify Identity, Auth0, etc.)
      const usersCollection = db.collection('users');
      
      const user = await usersCollection.findOne({ email });
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const hashedCurrentPassword = hashPassword(currentPassword);
      if (user.passwordHash !== hashedCurrentPassword) {
        return new Response(
          JSON.stringify({ error: 'Current password is incorrect' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const hashedNewPassword = hashPassword(newPassword);
      await usersCollection.updateOne(
        { email },
        { 
          $set: { 
            passwordHash: hashedNewPassword,
            _updatedDate: new Date()
          } 
        }
      );

      return new Response(
        JSON.stringify({ success: true, message: 'Password changed successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update password' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Password change error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
