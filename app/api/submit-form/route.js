import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

/* ────────────────────────────────────────────────
   DATABASE (SINGLETON CLIENT – VERY IMPORTANT)
──────────────────────────────────────────────── */
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('❌ MONGODB_URI is not defined');
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

/* ────────────────────────────────────────────────
   EMAIL (GMAIL SMTP)
──────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ────────────────────────────────────────────────
   TWILIO WHATSAPP
──────────────────────────────────────────────── */
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/* ────────────────────────────────────────────────
   POST HANDLER
──────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const data = await req.json();
    const { formType } = data;

    console.log('Received form submission:', JSON.stringify(data, null, 2));

    // Get DB connection (reused, no reconnect storms)
    const client = await clientPromise;
    const db = client.db('thecurvef');

    /* ────────────────────────────────────────────────
       BOOK A TUTOR
    ──────────────────────────────────────────────── */
    if (formType === 'tutor') {
      const { name, phone, grade, subjects, daysPerWeek } = data;

      if (
        !name?.trim() ||
        !phone?.trim() ||
        !grade?.trim() ||
        !subjects?.trim() ||
        !daysPerWeek?.trim()
      ) {
        return NextResponse.json(
          { error: 'Missing required fields for tutor booking' },
          { status: 400 },
        );
      }

      await db.collection('tutor_bookings').insertOne({
        name: name.trim(),
        phone: phone.trim(),
        grade: grade.trim(),
        subjects: subjects.trim(),
        daysPerWeek: daysPerWeek.trim(),
        status: 'pending',
        createdAt: new Date(),
      });

      await transporter.sendMail({
        from: `"TheCurveF" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: '📘 New Tutor Booking Request',
        html: `
          <h2>New Tutor Booking</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Grade:</b> ${grade}</p>
          <p><b>Subjects:</b> ${subjects}</p>
          <p><b>Days/Week:</b> ${daysPerWeek}</p>
        `,
      });

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${phone.trim()}`,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: JSON.stringify({
          '1': 'soon',
          '2': '24 hours',
        }),
      });

      return NextResponse.json({ success: true });
    }

    /* ────────────────────────────────────────────────
       STUDENT REGISTRATION
    ──────────────────────────────────────────────── */
    if (formType === 'registration') {
      const {
        fullName,
        gender = '',
        phone,
        school,
        grade,
        dob,
        parentName,
        parentPhone,
        subjects = '',
        paymentDate = '',
        agreedToPopia,
      } = data;

      if (
        !fullName?.trim() ||
        !phone?.trim() ||
        !school?.trim() ||
        !grade?.trim() ||
        !dob?.trim() ||
        !parentName?.trim() ||
        !parentPhone?.trim() ||
        agreedToPopia !== true
      ) {
        return NextResponse.json(
          { error: 'Missing required fields for registration' },
          { status: 400 },
        );
      }

      await db.collection('student_registrations').insertOne({
        fullName: fullName.trim(),
        gender: gender.trim(),
        phone: phone.trim(),
        school: school.trim(),
        grade: grade.trim(),
        dob: dob.trim(),
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        subjects: subjects.trim(),
        paymentDate: paymentDate.trim(),
        agreedToPopia: true,
        status: 'pending',
        createdAt: new Date(),
      });

      await transporter.sendMail({
        from: `"TheCurveF" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: '📚 New Student Registration',
        html: `
          <h2>New Student Registration</h2>
          <p><b>Child:</b> ${fullName}</p>
          <p><b>Grade:</b> ${grade}</p>
          <p><b>School:</b> ${school}</p>
          <p><b>Parent:</b> ${parentName} (${parentPhone})</p>
        `,
      });

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${parentPhone.trim()}`,
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: JSON.stringify({
          '1': 'shortly',
          '2': 'shortly',
        }),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid form type' },
      { status: 400 },
    );
  } catch (err) {
    console.error('API ERROR:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
