import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('thecurvef')

    const registrations = await db
      .collection('student_registrations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Admin registrations fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to load registrations' },
      { status: 500 }
    )
  }
}
