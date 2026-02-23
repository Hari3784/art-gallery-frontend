export default function VisitorDashboard({
  visitorTab,
  setVisitorTab,
  search,
  setSearch,
  filterCulture,
  setFilterCulture,
  filterCategory,
  setFilterCategory,
  filterArtist,
  setFilterArtist,
  cultures,
  categories,
  artists,
  priceRange,
  setPriceRange,
  filteredArtworks,
  imageFallbackMap,
  handleImageError,
  formatINR,
  setSelectedArtworkId,
  wishlist,
  toggleWishlist,
  cart,
  toggleCart,
  approvedArtworks,
  cartItems,
  cartTotal,
  selectedArtwork,
  exhibitions,
  checkoutForm,
  setCheckoutForm,
  checkoutError,
  checkoutSuccess,
  handleCheckout,
}) {
  return (
    <div className="page">
      <h2>Visitor Interface</h2>
      <div className="tabs">
        {['gallery', 'wishlist', 'cart', 'tour', 'checkout'].map((tab) => (
          <button
            key={tab}
            className={`btn ${visitorTab === tab ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setVisitorTab(tab)}
          >
            {tab === 'gallery' && 'Gallery Grid'}
            {tab === 'wishlist' && 'Wishlist'}
            {tab === 'cart' && 'Cart'}
            {tab === 'tour' && 'Virtual Tour'}
            {tab === 'checkout' && 'Checkout'}
          </button>
        ))}
      </div>

      {visitorTab === 'gallery' && (
        <>
          <section className="panel">
            <h3>Browse & Search</h3>
            <div className="input-grid filters-grid">
              <input
                className="input"
                placeholder="Search by title, artist, description"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select className="input" value={filterCulture} onChange={(event) => setFilterCulture(event.target.value)}>
                {cultures.map((culture) => <option key={culture}>{culture}</option>)}
              </select>
              <select className="input" value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <select className="input" value={filterArtist} onChange={(event) => setFilterArtist(event.target.value)}>
                {artists.map((artist) => <option key={artist}>{artist}</option>)}
              </select>
              <label className="range-wrap">
                Max Price: {formatINR(priceRange)}
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={priceRange}
                  onChange={(event) => setPriceRange(Number(event.target.value))}
                />
              </label>
            </div>
          </section>

          <div className="grid cards-3">
            {filteredArtworks.map((art) => (
              <article key={art.id} className="card">
                <div className="image-wrap">
                  <img
                    src={art.image}
                    alt={art.title}
                    onError={(event) => handleImageError(event, `gallery-${art.id}`)}
                  />
                  {imageFallbackMap[`gallery-${art.id}`] && (
                    <span className="img-fallback-badge">Image unavailable</span>
                  )}
                </div>
                <h4>{art.title}</h4>
                <p>{art.artist} · {art.culture} · {art.category}</p>
                <p className="muted">⭐ {art.rating} ({art.reviews} reviews)</p>
                <strong className="price-text">{formatINR(art.price)}</strong>
                <div className="actions-row">
                  <button className="btn btn-outline" onClick={() => { setSelectedArtworkId(art.id); setVisitorTab('tour') }}>
                    Details
                  </button>
                  <button className="btn btn-outline" onClick={() => toggleWishlist(art.id)}>
                    {wishlist.includes(art.id) ? 'Saved' : 'Wishlist'}
                  </button>
                  <button className="btn btn-primary" onClick={() => toggleCart(art.id)}>
                    {cart.includes(art.id) ? 'In Cart' : 'Add Cart'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {visitorTab === 'wishlist' && (
        <section className="panel">
          <h3>Wishlist</h3>
          {approvedArtworks.filter((art) => wishlist.includes(art.id)).map((art) => (
            <p key={art.id}>{art.title} by {art.artist} — {formatINR(art.price)}</p>
          ))}
          {wishlist.length === 0 && <p className="muted">No wishlist items yet.</p>}
        </section>
      )}

      {visitorTab === 'cart' && (
        <section className="panel">
          <h3>Cart</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="list-row">
              <span>{item.title} by {item.artist}</span>
              <div className="actions-row">
                <strong className="price-text">{formatINR(item.price)}</strong>
                <button className="btn btn-outline" onClick={() => toggleCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <h4>Total: {formatINR(cartTotal)}</h4>
          <button className="btn btn-primary" onClick={() => setVisitorTab('checkout')} disabled={!cartItems.length}>
            Go to Checkout
          </button>
        </section>
      )}

      {visitorTab === 'tour' && (
        <section className="panel">
          <h3>Virtual Tour</h3>
          {selectedArtwork ? (
            <div className="tour-layout">
              <div className="image-wrap">
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  onError={(event) => handleImageError(event, `tour-${selectedArtwork.id}`)}
                />
                {imageFallbackMap[`tour-${selectedArtwork.id}`] && (
                  <span className="img-fallback-badge">Image unavailable</span>
                )}
              </div>
              <div>
                <h4>{selectedArtwork.title}</h4>
                <p>{selectedArtwork.description}</p>
                <p><strong>Cultural Context:</strong> {selectedArtwork.historicalInfo}</p>
                <p>
                  <strong>Artist:</strong> {selectedArtwork.artist} · <strong>Period:</strong>{' '}
                  {selectedArtwork.period}
                </p>
              </div>
            </div>
          ) : (
            <p className="muted">Select an artwork from Gallery Grid to open detail tour view.</p>
          )}
          <h4>Featured Tours</h4>
          {exhibitions.map((tour) => (
            <p key={tour.id}>{tour.title} — {tour.virtualTour}</p>
          ))}
        </section>
      )}

      {visitorTab === 'checkout' && (
        <section className="panel">
          <h3>Checkout</h3>
          <p>Confirm your cart checklist and fill delivery/payment details.</p>

          <div className="checkout-grid">
            <div>
              <h4>Cart Checklist</h4>
              <ul className="order-checklist">
                {cartItems.map((item) => (
                  <li key={item.id}>✅ {item.title} — {formatINR(item.price)}</li>
                ))}
              </ul>
              {!cartItems.length && <p className="muted">No items in cart.</p>}
              <p><strong>Total Amount:</strong> {formatINR(cartTotal)}</p>
            </div>

            <div className="input-grid">
              <input
                className="input"
                placeholder="Purchaser Name"
                value={checkoutForm.purchaserName}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({ ...prev, purchaserName: event.target.value }))
                }
              />
              <input
                className="input"
                placeholder="Mobile Number"
                value={checkoutForm.mobile}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({ ...prev, mobile: event.target.value }))
                }
              />
              <textarea
                className="input"
                placeholder="Full Address"
                value={checkoutForm.address}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({ ...prev, address: event.target.value }))
                }
              />
              <input
                className="input"
                placeholder="Landmark Nearby"
                value={checkoutForm.landmark}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({ ...prev, landmark: event.target.value }))
                }
              />
              <select
                className="input"
                value={checkoutForm.paymentMethod}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({ ...prev, paymentMethod: event.target.value }))
                }
              >
                <option>UPI</option>
                <option>Card</option>
                <option>Net Banking</option>
                <option>Cash on Delivery</option>
              </select>
            </div>
          </div>

          {checkoutError && <p className="error-note">{checkoutError}</p>}
          {checkoutSuccess && <p className="success-note">{checkoutSuccess}</p>}

          <button className="btn btn-primary" onClick={handleCheckout} disabled={!cartItems.length}>
            Confirm Purchase
          </button>
        </section>
      )}
    </div>
  )
}
