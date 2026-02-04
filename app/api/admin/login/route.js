import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

/* ────────────────────────────────────────────────
   DATABASE CONNECTION (REUSE SINGLETON)
──────────────────────────────────────────────── */
const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

/* ────────────────────────────────────────────────
   ADMIN LOGIN ROUTE
──────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const dbClient = await clientPromise;
    const db = dbClient.db('thecurvef');

    // Only ONE admin exists
    const admin = await db.collection('admins').findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create secure session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Admin logged in',
    });

    response.cookies.set({
      name: 'admin_session',
      value: admin._id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 4, // 4 hours
    });

    return response;
  } catch (err) {
    console.error('🔥 ADMIN LOGIN ERROR:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
