import { headers } from 'next/headers'

export default async function AdminPage() {
  // Build absolute URL safely (works local + Vercel)
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https'

  const res = await fetch(
    `${protocol}://${host}/api/admin/registrations`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to load registrations')
  }

  const registrations = await res.json()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Student Registrations</h1>

      {registrations.length === 0 && <p>No registrations found.</p>}

      {registrations.map((r) => (
        <div
          key={r._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <h3>{r.fullName}</h3>

          <p><strong>Gender:</strong> {r.gender}</p>
          <p><strong>Learner Phone:</strong> {r.phone}</p>
          <p><strong>School:</strong> {r.school}</p>
          <p><strong>Address:</strong> {r.address}</p>
          <p><strong>Grade:</strong> {r.grade}</p>
          <p><strong>Date of Birth:</strong> {r.dob}</p>

          <p>
            <strong>Subjects:</strong>{' '}
            {Array.isArray(r.subjects) ? r.subjects.join(', ') : r.subjects}
          </p>

          <hr />

          <p><strong>Parent Name:</strong> {r.parentName}</p>
          <p><strong>Parent Phone:</strong> {r.parentPhone}</p>
          <p><strong>Payment Date:</strong> {r.paymentDate}</p>

          <p>
            <strong>POPIA Consent:</strong>{' '}
            {r.agreedToPopia ? 'Yes' : 'No'}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {r.status || 'pending'}
          </p>

          <p style={{ fontSize: 12, color: '#666' }}>
            Submitted:{' '}
            {r.createdAt
              ? new Date(r.createdAt).toLocaleString()
              : 'Unknown'}
          </p>
        </div>
      ))}
    </main>
  )
}
