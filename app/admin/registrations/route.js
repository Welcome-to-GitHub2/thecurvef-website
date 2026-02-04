import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

const client = new MongoClient(process.env.MONGODB_URI)

export async function GET() {
  await client.connect()

  const data = await client
    .db('thecurvef')
    .collection('student_registrations')
    .find()
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json(data)
}
