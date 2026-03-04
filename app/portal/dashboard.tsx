export default function Dashboard({
  email,
  role,
  books,
}: {
  email: string
  role: string
  books: any[]
}) {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Author Portal</h1>

      <div style={{ marginBottom: 20 }}>
        <b>User:</b> {email}
        <br />
        <b>Role:</b> {role}
      </div>

      <hr />

      <h2>Books</h2>

      {books.length === 0 && <p>No books yet</p>}

      {books.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <b>{b.title}</b>
          <div>{b.description}</div>
        </div>
      ))}
    </div>
  )
}