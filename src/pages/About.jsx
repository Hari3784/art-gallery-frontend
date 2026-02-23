export default function About({ exhibitions = [] }) {
  const spotlightExhibitions = exhibitions
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)

  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>About Art Gallery</h1>
          <p>
            Art Gallery is a curated platform connecting collectors, artists, curators, and
            cultural communities through high-quality global artworks.
          </p>
          <p>
            Explore diverse collections, discover verified creators, and experience art narratives
            shaped by heritage and contemporary practice.
          </p>
          <p>
            Our platform is built to celebrate artistic excellence through trusted curation,
            transparent discovery, and meaningful cultural context. From first-time buyers to
            experienced collectors, we provide a professional space where every artwork is
            presented with authenticity, insight, and global relevance.
          </p>
        </div>
      </section>

      {spotlightExhibitions.length > 0 && (
        <section className="panel">
          <h3>Curator Picks Today</h3>
          {spotlightExhibitions.map((showcase) => (
            <article key={showcase.id} className="card compact">
              <h4>{showcase.title}</h4>
              <p><strong>Theme:</strong> {showcase.theme || 'General'} · <strong>Culture:</strong> {showcase.culture || 'Global'}</p>
              <p><strong>Tour:</strong> {showcase.virtualTour || 'Virtual tour available soon'}</p>
              <p>{showcase.commentary || 'Freshly curated exhibition available now.'}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}