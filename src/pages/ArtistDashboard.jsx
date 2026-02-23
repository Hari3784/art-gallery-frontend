export default function ArtistDashboard({
  uploadForm,
  setUploadForm,
  handleArtworkUpload,
  artistArtworks,
  removeArtwork,
  imageFallbackMap,
  handleImageError,
  formatINR,
  artistSales,
  artistRevenue,
  pendingArtworks,
}) {
  return (
    <div className="page">
      <h2>Artist Dashboard</h2>
      <section className="panel">
        <h3>Upload Artwork</h3>
        <div className="input-grid">
          <input className="input" placeholder="Title" value={uploadForm.title} onChange={(event) => setUploadForm((prev) => ({ ...prev, title: event.target.value }))} />
          <select className="input" value={uploadForm.category} onChange={(event) => setUploadForm((prev) => ({ ...prev, category: event.target.value }))}>
            <option>Painting</option>
            <option>Sculpture</option>
            <option>Digital Art</option>
            <option>Photography</option>
          </select>
          <input className="input" placeholder="Culture" value={uploadForm.culture} onChange={(event) => setUploadForm((prev) => ({ ...prev, culture: event.target.value }))} />
          <input className="input" placeholder="Period" value={uploadForm.period} onChange={(event) => setUploadForm((prev) => ({ ...prev, period: event.target.value }))} />
          <input className="input" placeholder="Price" type="number" value={uploadForm.price} onChange={(event) => setUploadForm((prev) => ({ ...prev, price: event.target.value }))} />
          <input className="input" placeholder="Image URL" value={uploadForm.image} onChange={(event) => setUploadForm((prev) => ({ ...prev, image: event.target.value }))} />
          <textarea className="input" placeholder="Description" value={uploadForm.description} onChange={(event) => setUploadForm((prev) => ({ ...prev, description: event.target.value }))} />
          <textarea className="input" placeholder="Cultural & historical info" value={uploadForm.historicalInfo} onChange={(event) => setUploadForm((prev) => ({ ...prev, historicalInfo: event.target.value }))} />
        </div>
        <button className="btn btn-primary" onClick={handleArtworkUpload}>Upload for Approval</button>
      </section>

      <section className="panel">
        <h3>My Artworks</h3>
        <div className="grid artist-grid">
          {artistArtworks.map((art) => (
            <article key={art.id} className="card artist-box">
              <div className="image-wrap">
                <img
                  src={art.image}
                  alt={art.title}
                  onError={(event) => handleImageError(event, `artist-${art.id}`)}
                />
                {imageFallbackMap[`artist-${art.id}`] && (
                  <span className="img-fallback-badge">Image unavailable</span>
                )}
              </div>
              <h4>{art.title}</h4>
              <p className="muted">{art.category} · {art.culture}</p>
              <p><strong>Status:</strong> {art.status}</p>
              <p className="price-text">{formatINR(art.price)}</p>
              <div className="actions-row">
                <button className="btn btn-outline" onClick={() => removeArtwork(art.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel stats-grid">
        <div><h4>Sales</h4><p>{artistSales.length}</p></div>
        <div><h4>Revenue</h4><p>{formatINR(artistRevenue)}</p></div>
        <div><h4>Notifications</h4><p>{pendingArtworks.length} artworks awaiting admin review</p></div>
      </section>
    </div>
  )
}
