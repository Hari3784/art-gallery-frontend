export default function AdminDashboard({
  users,
  changeUserRole,
  pendingArtworks,
  updateArtworkStatus,
  removeArtwork,
  transactions,
  formatINR,
  approvedArtworks,
  totalRevenue,
  approvedArtworksCount,
  activeUsersCount,
}) {
  const approvedCount = approvedArtworksCount ?? approvedArtworks.length
  const activeUsers = activeUsersCount ?? users.length

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <section className="panel">
        <h3>User Management & Role Assignment</h3>
        {users.map((user) => (
          <div key={user.id} className="list-row">
            <span>{user.name} ({user.email})</span>
            <select className="input mini" value={user.role} onChange={(event) => changeUserRole(user.id, event.target.value)}>
              <option>Admin</option>
              <option>Artist</option>
              <option>Visitor</option>
              <option>Curator</option>
            </select>
          </div>
        ))}
      </section>

      <section className="panel">
        <h3>Artwork Approval & Content Moderation</h3>
        {pendingArtworks.map((art) => (
          <div key={art.id} className="list-row">
            <span>{art.title} by {art.artist}</span>
            <div className="actions-row">
              <button className="btn btn-primary" onClick={() => updateArtworkStatus(art.id, 'approved')}>Approve</button>
              <button className="btn btn-outline" onClick={() => removeArtwork(art.id)}>Reject</button>
            </div>
          </div>
        ))}
        {!pendingArtworks.length && <p className="muted">No pending artworks.</p>}
      </section>

      <section className="panel stats-grid">
        <div><h4>Transactions</h4><p>{transactions.length}</p></div>
        <div><h4>Total Revenue</h4><p>{formatINR(totalRevenue)}</p></div>
        <div><h4>Approved Artworks</h4><p>{approvedCount}</p></div>
        <div><h4>Active Users</h4><p>{activeUsers}</p></div>
      </section>

      <section className="panel">
        <h3>Recent Sales</h3>
        {transactions.slice(0, 5).map((tx) => (
          <p key={tx.id}>{tx.date}: {tx.artworkTitle} sold to {tx.buyer} for {formatINR(tx.price)}</p>
        ))}
        {!transactions.length && <p className="muted">No sales yet.</p>}
      </section>
    </div>
  )
}
