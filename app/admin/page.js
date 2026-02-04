export default async function AdminPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/registrations`,
    { cache: 'no-store' }
  )

  const data = await res.json()

  return (
    <div style={{ padding: 40 }}>
      <h1>Student Registrations</h1>

      {data.map((r) => (
        <div key={r._id} style={{ borderBottom: '1px solid #ddd', marginBottom: 20 }}>
          <p><strong>{r.fullName}</strong> — {r.grade}</p>
          <p>Parent: {r.parentName} ({r.parentPhone})</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  )
}
