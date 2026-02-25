import express from 'express'

const router = express.Router()

const artworks = [
  {
    id: 1,
    title: 'Temple Dawn',
    artist: 'Aarav Iyer',
    culture: 'Indian',
    period: '18th Century Inspired',
    category: 'Painting',
    price: 28500,
    description: 'A sunrise view over a South Indian temple complex.',
    historicalInfo: 'Inspired by mural traditions from Thanjavur.',
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=80',
    status: 'approved',
    rating: 4.7,
    reviews: 86,
    featured: true,
  },
  {
    id: 2,
    title: 'Kyoto Monsoon',
    artist: 'Mei Tanaka',
    culture: 'Japanese',
    period: 'Modern',
    category: 'Digital Art',
    price: 32400,
    description: 'Rain-soaked streets around old Kyoto neighborhoods.',
    historicalInfo: 'Reflects ukiyo-e composition with modern lighting.',
    image: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?auto=format&fit=crop&w=1000&q=80',
    status: 'approved',
    rating: 4.8,
    reviews: 63,
    featured: true,
  },
  {
    id: 3,
    title: 'Bronze Chronicle',
    artist: 'Lucas Moretti',
    culture: 'Italian',
    period: 'Renaissance Inspired',
    category: 'Sculpture',
    price: 74800,
    description: 'Miniature bronze figures inspired by civic life.',
    historicalInfo: 'Built from references to Florentine guild archives.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80',
    status: 'pending',
    rating: 0,
    reviews: 0,
    featured: false,
  },
]

const toNumber = (value) => Number(value)

router.get('/', (req, res) => {
  const { status, search } = req.query
  let results = artworks

  if (status) {
    results = results.filter((item) => item.status === String(status).toLowerCase())
  }

  if (search) {
    const normalized = String(search).toLowerCase()
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.artist.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized),
    )
  }

  return res.json(results)
})

router.get('/:id', (req, res) => {
  const id = toNumber(req.params.id)
  const artwork = artworks.find((item) => item.id === id)

  if (!artwork) {
    return res.status(404).json({ message: 'Artwork not found' })
  }

  return res.json(artwork)
})

router.post('/', (req, res) => {
  const { title, category, price, image, artist, culture, period, description, historicalInfo } = req.body

  if (!title || !category || price === undefined || !image) {
    return res.status(400).json({ message: 'title, category, price, and image are required' })
  }

  const nextId = artworks.length ? Math.max(...artworks.map((item) => item.id)) + 1 : 1
  const newArtwork = {
    id: nextId,
    title,
    artist: artist || 'Unknown Artist',
    culture: culture || '',
    period: period || '',
    category,
    price: Number(price),
    description: description || '',
    historicalInfo: historicalInfo || '',
    image,
    status: 'pending',
    rating: 0,
    reviews: 0,
    featured: false,
  }

  artworks.push(newArtwork)
  return res.status(201).json(newArtwork)
})

router.put('/:id', (req, res) => {
  const id = toNumber(req.params.id)
  const index = artworks.findIndex((item) => item.id === id)

  if (index === -1) {
    return res.status(404).json({ message: 'Artwork not found' })
  }

  const current = artworks[index]
  const updated = {
    ...current,
    ...req.body,
    id,
    price: req.body.price !== undefined ? Number(req.body.price) : current.price,
    status: req.body.status ? String(req.body.status).toLowerCase() : current.status,
  }

  artworks[index] = updated
  return res.json(updated)
})

router.delete('/:id', (req, res) => {
  const id = toNumber(req.params.id)
  const index = artworks.findIndex((item) => item.id === id)

  if (index === -1) {
    return res.status(404).json({ message: 'Artwork not found' })
  }

  const [removed] = artworks.splice(index, 1)
  return res.json({ message: 'Artwork deleted', artwork: removed })
})

export default router
