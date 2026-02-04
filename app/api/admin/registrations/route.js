import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is not defined')
}

// Reuse Mongo client
let clientPromise

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('thecurvef')

    const registrations = await db
      .collection('student_registrations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // 👇 TEMPORARY DEBUG (REMOVE AFTER)
    console.log('SAMPLE REGISTRATION:', registrations[0])

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Admin registrations fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to load registrations' },
      { status: 500 }
    )
  }
}
