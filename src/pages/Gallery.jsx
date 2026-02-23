import { useState, useMemo } from 'react'
import ArtworkCard from '../components/ArtworkCard'
import artworksData from '../data/artworks'

const fallbackArtworkImage =
  'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1000&q=80'

const initialArtworks = artworksData

export default function Gallery() {
  const [selectedCulture, setSelectedCulture] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [imageFallbackMap, setImageFallbackMap] = useState({})
  const [cart, setCart] = useState([])

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const handleImageError = (event, fallbackKey) => {
    event.currentTarget.src = fallbackArtworkImage
    setImageFallbackMap((prev) => ({ ...prev, [fallbackKey]: true }))
  }

  const handleAddToCart = (artwork) => {
    setCart((prev) => [...prev, artwork])
    alert(`${artwork.title} added to cart!`)
  }

  const handleAddToWishlist = (artwork) => {
    alert(`${artwork.title} added to wishlist!`)
  }

  const filteredArtworks = useMemo(() => {
    return initialArtworks.filter((art) => {
      const cultureMatch = selectedCulture === 'all' || art.culture === selectedCulture
      const categoryMatch = selectedCategory === 'all' || art.category === selectedCategory
      return cultureMatch && categoryMatch && art.status === 'approved'
    })
  }, [selectedCulture, selectedCategory])

  const cultures = ['all', ...new Set(initialArtworks.map((a) => a.culture))]
  const categories = ['all', ...new Set(initialArtworks.map((a) => a.category))]

  return (
    <div className="page">
      <section className="gallery-header">
        <h1>Explore Artworks</h1>
        <p>Discover curated collections from around the world</p>
      </section>

      <section className="gallery-filters">
        <div className="filter-group">
          <label>Culture</label>
          <select
            value={selectedCulture}
            onChange={(e) => setSelectedCulture(e.target.value)}
            className="input"
          >
            {cultures.map((culture) => (
              <option key={culture} value={culture}>
                {culture === 'all' ? 'All Cultures' : culture}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="gallery-grid">
        {filteredArtworks.length > 0 ? (
          filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onImageError={handleImageError}
              imageFallbackMap={imageFallbackMap}
              formatINR={formatINR}
            />
          ))
        ) : (
          <p className="empty-state">No artworks found matching your filters.</p>
        )}
      </section>
    </div>
  )
}
