export default function CuratorDashboard({
  exhibitionForm,
  setExhibitionForm,
  addExhibition,
  removeExhibition,
  exhibitions,
}) {
  return (
    <div className="page">
      <h2>Curator Dashboard</h2>
      <section className="panel">
        <h3>Create Exhibition</h3>
        <div className="input-grid">
          <input className="input" placeholder="Exhibition title" value={exhibitionForm.title} onChange={(event) => setExhibitionForm((prev) => ({ ...prev, title: event.target.value }))} />
          <input className="input" placeholder="Theme" value={exhibitionForm.theme} onChange={(event) => setExhibitionForm((prev) => ({ ...prev, theme: event.target.value }))} />
          <input className="input" placeholder="Culture focus" value={exhibitionForm.culture} onChange={(event) => setExhibitionForm((prev) => ({ ...prev, culture: event.target.value }))} />
          <input className="input" placeholder="Virtual tour label" value={exhibitionForm.virtualTour} onChange={(event) => setExhibitionForm((prev) => ({ ...prev, virtualTour: event.target.value }))} />
          <textarea className="input" placeholder="Expert commentary" value={exhibitionForm.commentary} onChange={(event) => setExhibitionForm((prev) => ({ ...prev, commentary: event.target.value }))} />
          <label className="check-row">
            <input type="checkbox" checked={exhibitionForm.featured} onChange={(event) => setExhibitionForm((prev) => ({ ...prev, featured: event.target.checked }))} />
            Highlight as featured
          </label>
        </div>
        <button className="btn btn-primary" onClick={addExhibition}>Publish Exhibition</button>
      </section>

      <section className="panel">
        <h3>Manage Themes, Commentary, Virtual Tours</h3>
        {exhibitions.map((showcase) => (
          <article key={showcase.id} className="card compact">
            <h4>{showcase.title}</h4>
            <p><strong>Theme:</strong> {showcase.theme} · <strong>Culture:</strong> {showcase.culture}</p>
            <p>{showcase.commentary || 'No commentary added yet.'}</p>
            <p><strong>Tour:</strong> {showcase.virtualTour}</p>
            <p><strong>Featured:</strong> {showcase.featured ? 'Yes' : 'No'}</p>
            <div className="actions-row">
              <button className="btn btn-outline" onClick={() => removeExhibition(showcase.id)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
