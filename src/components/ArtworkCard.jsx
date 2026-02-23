export default function ArtworkCard({
  artwork,
  onAddToCart,
  onAddToWishlist,
  onImageError,
  imageFallbackMap,
  formatINR,
}) {
  const isFallback = imageFallbackMap?.[`card-${artwork.id}`]

  return (
    <article className="artwork-card">
      <div className="artwork-image-wrapper">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="artwork-image"
          onError={(e) => onImageError?.(e, `card-${artwork.id}`)}
        />
        {isFallback && <span className="img-fallback-badge">Image unavailable</span>}
        
        {artwork.featured && (
          <span className="featured-badge">Featured</span>
        )}
        
        <div className="artwork-overlay">
          <div className="artwork-actions">
            {onAddToWishlist && (
              <button
                className="action-btn wishlist-btn"
                title="Add to Wishlist"
                onClick={(e) => {
                  e.preventDefault()
                  onAddToWishlist?.(artwork)
                }}
              >
                ♡
              </button>
            )}
            {onAddToCart && (
              <button
                className="action-btn cart-btn"
                title="Add to Cart"
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart?.(artwork)
                }}
              >
                🛒
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="artwork-content">
        <h3 className="artwork-title">{artwork.title}</h3>
        
        <p className="artwork-artist">by {artwork.artist}</p>
        
        <div className="artwork-meta">
          <span className="culture-tag">{artwork.culture}</span>
          <span className="category-tag">{artwork.category}</span>
        </div>

        <p className="artwork-period">{artwork.period}</p>

        {artwork.description && (
          <p className="artwork-description">{artwork.description}</p>
        )}

        <div className="artwork-footer">
          <div className="rating">
            {'⭐'.repeat(Math.round(artwork.rating || 0))}
            {artwork.reviews && <span className="reviews-count">({artwork.reviews})</span>}
          </div>
          <p className="artwork-price">{formatINR?.(artwork.price) || `₹${artwork.price}`}</p>
        </div>

        {artwork.status && artwork.status !== 'approved' && (
          <p className="artwork-status">{artwork.status}</p>
        )}
      </div>
    </article>
  )
}
