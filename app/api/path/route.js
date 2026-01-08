import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME || 'thecurvef_db'

let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }
  const client = new MongoClient(MONGO_URL)
  await client.connect()
  cachedClient = client
  return client
}

export async function POST(request) {
  const { pathname } = new URL(request.url)

  // Handle form submissions
  if (pathname.includes('/api/submit-form')) {
    try {
      const { formType, data } = await request.json()

      // Validate required fields
      if (!formType || !data) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      if (formType === 'tutor') {
        if (!data.name || !data.phone || !data.grade || !data.subjects || !data.daysPerWeek) {
          return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }
      } else if (formType === 'contact') {
        if (!data.name || !data.phone || !data.message) {
          return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }
      }

      // Save to database
      const client = await connectToDatabase()
      const db = client.db(DB_NAME)
      const collection = formType === 'tutor' ? 'tutor_bookings' : 'contact_messages'

      const document = {
        id: uuidv4(),
        ...data,
        formType,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }

      await collection.insertOne(document)

      // Send email notification using SendGrid (if API key is set)
      const sendGridApiKey = process.env.SENDGRID_API_KEY
      const toEmail = process.env.TO_EMAIL || 'Ntashkills@gmail.com'

      if (sendGridApiKey && sendGridApiKey !== 'your_sendgrid_api_key_here') {
        try {
          let emailSubject = ''
          let emailBody = ''

          if (formType === 'tutor') {
            emailSubject = `New Tutor Booking Request - ${data.name}`
            emailBody = `
              <h2>New Tutor Booking Request</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
              <p><strong>Grade:</strong> ${data.grade}</p>
              <p><strong>Subjects:</strong> ${data.subjects}</p>
              <p><strong>Days per Week:</strong> ${data.daysPerWeek}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            `
          } else if (formType === 'contact') {
            emailSubject = `New Contact Form Message - ${data.name}`
            emailBody = `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
              <p><strong>Message:</strong></p>
              <p>${data.message}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            `
          }

          const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sendGridApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: toEmail }],
                subject: emailSubject
              }],
              from: { email: toEmail },
              content: [{
                type: 'text/html',
                value: emailBody
              }]
            })
          })

          if (!emailResponse.ok) {
            console.error('SendGrid email failed:', await emailResponse.text())
          }
        } catch (emailError) {
          console.error('Error sending email:', emailError)
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully! We will contact you soon.',
        id: document.id
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Route not found' }, { status: 404 })
}

export async function GET(request) {
  const { pathname } = new URL(request.url)

  // Health check endpoint
  if (pathname.includes('/api/health')) {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  }

  // Get all tutor bookings (for admin)
  if (pathname.includes('/api/tutor-bookings')) {
    try {
      const client = await connectToDatabase()
      const db = client.db(DB_NAME)
      const bookings = await db.collection('tutor_bookings').find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json({ bookings })
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }
  }

  // Get all contact messages (for admin)
  if (pathname.includes('/api/contact-messages')) {
    try {
      const client = await connectToDatabase()
      const db = client.db(DB_NAME)
      const messages = await db.collection('contact_messages').find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json({ messages })
    } catch (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Route not found' }, { status: 404 })
}
