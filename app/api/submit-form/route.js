import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

/* ────────────────────────────────────────────────
   ENV VALIDATION
──────────────────────────────────────────────── */
const {
  MONGODB_URI,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_TO,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER,
} = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}
if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
  throw new Error('Email environment variables are not fully defined');
}

/* ────────────────────────────────────────────────
   DATABASE (SINGLETON)
──────────────────────────────────────────────── */
let clientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

/* ────────────────────────────────────────────────
   EMAIL
──────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/* ────────────────────────────────────────────────
   TWILIO
──────────────────────────────────────────────── */
const twilioClient =
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

/* ────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────── */
function formatSouthAfricanPhone(phone) {
  if (!phone || typeof phone !== 'string') return null;

  const cleaned = phone.replace(/\s+/g, '');

  // 076xxxxxxx → +2776xxxxxxx
  if (/^0\d{9}$/.test(cleaned)) {
    return '+27' + cleaned.slice(1);
  }

  // 27xxxxxxxxx → +27xxxxxxxxx
  if (/^27\d{9}$/.test(cleaned)) {
    return '+' + cleaned;
  }

  // +27xxxxxxxxx
  if (/^\+27\d{9}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

/* ────────────────────────────────────────────────
   POST HANDLER
──────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const data = await req.json();
    const { formType } = data;

    console.log('📥 Received form submission:', data);

    const client = await clientPromise;
    const db = client.db('thecurvef');

    /* ──────────────── BOOK A TUTOR ─────────────── */
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
          { error: 'Missing required tutor fields' },
          { status: 400 }
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
        from: `"TheCurveF" <${EMAIL_USER}>`,
        to: EMAIL_TO,
        subject: '📘 New Tutor Booking',
        html: `<p><b>${name}</b> booked a tutor.</p>`,
      });

      const tutorWhatsapp = formatSouthAfricanPhone(phone);

      if (twilioClient && tutorWhatsapp) {
        try {
          await twilioClient.messages.create({
            from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${tutorWhatsapp}`,
            body: `Hello ${name},

Thank you for contacting TheCurveF.
We have received your tutor booking request for ${grade}.

Subjects: ${subjects}
Sessions per week: ${daysPerWeek}

Our team will contact you shortly.

Kind regards,
TheCurveF Team`,
          });
        } catch (err) {
          console.warn('⚠️ Tutor WhatsApp failed:', err.message);
        }
      }

      return NextResponse.json({ success: true });
    }

    /* ───────────── STUDENT REGISTRATION ───────────── */
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
          { error: 'Missing required registration fields' },
          { status: 400 }
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
  from: '"TheCurveF" <info@thecurvef.co.za>',
  to: EMAIL_TO,
  subject: '📚 New Student Registration — Action Required',
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin-bottom: 10px;">📚 New Student Registration</h2>

      <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>

      <hr />

      <h3>Learner Information</h3>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Gender:</strong> ${gender || 'Not specified'}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>School:</strong> ${school}</p>
      <p><strong>Grade:</strong> ${grade}</p>
      <p><strong>Date of Birth:</strong> ${dob}</p>
      <p><strong>Subjects:</strong> ${subjects || 'Not specified'}</p>

      <hr />

      <h3>Parent / Guardian Information</h3>
      <p><strong>Name:</strong> ${parentName}</p>
      <p><strong>Phone:</strong> ${parentPhone}</p>

      <hr />

      <h3>Payment & Consent</h3>
      <p><strong>Payment Date:</strong> ${paymentDate || 'Not provided'}</p>
      <p><strong>POPIA Consent:</strong> ✅ Agreed</p>

      <hr />

      <p style="font-size: 14px; color: #555;">
        Status: <strong>Pending Review</strong><br />
        This registration was submitted via <strong>TheCurveF Website</strong>.
      </p>
    </div>
  `,
});


      const formattedPhone = formatSouthAfricanPhone(parentPhone);

      if (twilioClient && formattedPhone) {
        try {
          await twilioClient.messages.create({
            from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${formattedPhone}`,
            body: `Hello ${parentName},

Thank you for registering with TheCurveF.
We have successfully received the student registration for ${fullName} (Grade ${grade}).

Our team is currently reviewing the details and confirming payment.
We will contact you shortly with the next steps.

Kind regards,
TheCurveF Team`,
          });
        } catch (err) {
          console.warn('⚠️ Parent WhatsApp failed:', err.message);
        }
      } else {
        console.warn('⚠️ WhatsApp skipped (invalid parent phone):', parentPhone);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid form type' },
      { status: 400 }
    );
  } catch (err) {
    console.error('🔥 API ERROR:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
