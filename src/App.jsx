import { useEffect, useState, useMemo, useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import './App.css'

import { AuthProvider, AuthContext } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import VisitorDashboard from './pages/VisitorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ArtistDashboard from './pages/ArtistDashboard'
import CuratorDashboard from './pages/CuratorDashboard'
import artworksData from './data/artworks'

const API_BASE_URL = 'http://localhost:5000/api/v1'
const LOCAL_SALES_STORAGE_KEY = 'local_sales_records'
const LOCAL_EXHIBITIONS_STORAGE_KEY = 'local_exhibitions'
const fallbackArtworkImage =
  'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1000&q=80'

const initialArtworks = artworksData

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@gallery.com', role: 'Admin' },
  { id: 2, name: 'Artist Demo', email: 'artist@gallery.com', role: 'Artist' },
  { id: 3, name: 'Curator Demo', email: 'curator@gallery.com', role: 'Curator' },
  { id: 4, name: 'Visitor Demo', email: 'visitor@gallery.com', role: 'Visitor' },
]

function AppContent() {
  const { user } = useContext(AuthContext)

  const [artworks, setArtworks] = useState(initialArtworks)
  const [users, setUsers] = useState(initialUsers)
  const [imageFallbackMap, setImageFallbackMap] = useState({})
  const [visitorTab, setVisitorTab] = useState('gallery')
  const [search, setSearch] = useState('')
  const [filterCulture, setFilterCulture] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterArtist, setFilterArtist] = useState('All')
  const [priceRange, setPriceRange] = useState(100000)
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [selectedArtworkId, setSelectedArtworkId] = useState(null)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Painting',
    culture: '',
    period: '',
    price: '',
    image: '',
    description: '',
    historicalInfo: '',
  })
  const [exhibitionForm, setExhibitionForm] = useState({
    title: '',
    theme: '',
    culture: '',
    virtualTour: '',
    commentary: '',
    featured: false,
  })
  const [exhibitions, setExhibitions] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_EXHIBITIONS_STORAGE_KEY)
      if (!stored) {
        return []
      }
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [checkoutForm, setCheckoutForm] = useState({
    purchaserName: '',
    mobile: '',
    address: '',
    landmark: '',
    paymentMethod: 'UPI',
  })
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutSuccess, setCheckoutSuccess] = useState('')
  const [adminOverview, setAdminOverview] = useState(null)
  const [adminTransactions, setAdminTransactions] = useState([])
  const [localSalesRecords, setLocalSalesRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_SALES_STORAGE_KEY)
      if (!stored) {
        return []
      }
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const fetchAuthorized = async (path, options = {}) => {
    const token = localStorage.getItem('token')
    const headers = {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    let response
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      })
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Unable to connect to backend server. Please start backend or use demo checkout.')
      }
      throw error
    }

    if (!response.ok) {
      let errorMessage = 'Request failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        // no-op
      }
      throw new Error(errorMessage)
    }

    return response.json()
  }

  const normalizeRole = (role = 'VISITOR') =>
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

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

  const cultures = useMemo(() => {
    return ['All', ...new Set(artworks.map((art) => art.culture))]
  }, [artworks])

  const categories = useMemo(() => {
    return ['All', ...new Set(artworks.map((art) => art.category))]
  }, [artworks])

  const artists = useMemo(() => {
    return ['All', ...new Set(artworks.map((art) => art.artist))]
  }, [artworks])

  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(search.toLowerCase()) ||
        art.artist.toLowerCase().includes(search.toLowerCase()) ||
        art.description.toLowerCase().includes(search.toLowerCase())
      const matchesCulture = filterCulture === 'All' || art.culture === filterCulture
      const matchesCategory = filterCategory === 'All' || art.category === filterCategory
      const matchesArtist = filterArtist === 'All' || art.artist === filterArtist
      const matchesPrice = art.price <= priceRange
      return matchesSearch && matchesCulture && matchesCategory && matchesArtist && matchesPrice
    })
  }, [artworks, search, filterCulture, filterCategory, filterArtist, priceRange])

  const approvedArtworks = useMemo(() => artworks.filter((a) => a.status === 'approved'), [artworks])
  const pendingArtworks = useMemo(() => artworks.filter((a) => a.status === 'pending'), [artworks])
  const artistArtworks = useMemo(() => artworks.filter((a) => a.artist === user?.name), [artworks, user])
  const cartItems = useMemo(() => artworks.filter((a) => cart.includes(a.id)), [artworks, cart])
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price, 0), [cartItems])
  const artistSales = useMemo(
    () => localSalesRecords.filter((sale) => sale.artist === user?.name),
    [localSalesRecords, user],
  )
  const artistRevenue = useMemo(() => artistSales.reduce((sum, item) => sum + Number(item.price || 0), 0), [artistSales])
  const selectedArtwork = artworks.find((a) => a.id === selectedArtworkId)
  const transactions = useMemo(
    () =>
      localSalesRecords
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((sale) => ({
          id: sale.id,
          date: new Date(sale.createdAt).toLocaleDateString(),
          artworkTitle: sale.artworkTitle,
          buyer: sale.buyer,
          price: Number(sale.price || 0),
        })),
    [localSalesRecords],
  )
  const totalRevenue = useMemo(() => transactions.reduce((sum, tx) => sum + tx.price, 0), [transactions])
  const adminEnabled = user?.role === 'Admin' && adminOverview
  const dashboardTransactions = adminEnabled ? adminTransactions : transactions
  const dashboardTotalRevenue = adminEnabled ? Number(adminOverview.totalRevenue || 0) : totalRevenue
  const dashboardApprovedCount = adminEnabled ? Number(adminOverview.approvedArtworks || 0) : approvedArtworks.length
  const dashboardActiveUsers = adminEnabled ? Number(adminOverview.totalUsers || 0) : users.length

  useEffect(() => {
    if (user?.role !== 'Admin') {
      return
    }

    let isCancelled = false

    const loadAdminDashboardData = async () => {
      try {
        const [overviewData, transactionRows, userRows] = await Promise.all([
          fetchAuthorized('/analytics/overview'),
          fetchAuthorized('/analytics/transactions'),
          fetchAuthorized('/users'),
        ])

        if (isCancelled) {
          return
        }

        setAdminOverview(overviewData)
        setAdminTransactions(
          transactionRows.map((row) => ({
            id: row.id,
            date: new Date(row.created_at).toLocaleDateString(),
            artworkTitle: row.artwork_title || `Order #${row.order_id}`,
            buyer: row.buyer_name,
            price: Number(row.total_amount || 0),
          })),
        )
        setUsers(
          userRows.map((row) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: normalizeRole(row.role),
          })),
        )
      } catch (error) {
        console.error('Failed to load admin dashboard data:', error)
      }
    }

    loadAdminDashboardData()

    return () => {
      isCancelled = true
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(LOCAL_SALES_STORAGE_KEY, JSON.stringify(localSalesRecords))
  }, [localSalesRecords])

  useEffect(() => {
    localStorage.setItem(LOCAL_EXHIBITIONS_STORAGE_KEY, JSON.stringify(exhibitions))
  }, [exhibitions])

  const recordCompletedSales = (items) => {
    if (!items.length) {
      return
    }

    const createdAt = new Date().toISOString()
    const buyerName = user?.name || checkoutForm.purchaserName || 'Guest'
    const newRecords = items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      createdAt,
      artworkTitle: item.title,
      artist: item.artist,
      buyer: buyerName,
      price: Number(item.price || 0),
    }))

    setLocalSalesRecords((prev) => [...newRecords, ...prev])
  }

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleCart = (id) => {
    setCart((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleArtworkUpload = () => {
    if (!uploadForm.title || !uploadForm.price || !uploadForm.image) {
      alert('Please fill all required fields')
      return
    }
    const newArtwork = {
      id: artworks.length + 1,
      ...uploadForm,
      artist: user?.name || 'Unknown Artist',
      price: Number(uploadForm.price),
      status: 'pending',
      rating: 0,
      reviews: 0,
      featured: false,
    }
    setArtworks((prev) => [...prev, newArtwork])
    alert('Artwork uploaded for admin approval!')
    setUploadForm({
      title: '',
      category: 'Painting',
      culture: '',
      period: '',
      price: '',
      image: '',
      description: '',
      historicalInfo: '',
    })
  }

  const addExhibition = () => {
    if (!exhibitionForm.title) {
      alert('Please enter exhibition title')
      return
    }
    const newExhibition = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...exhibitionForm,
    }
    setExhibitions((prev) => [...prev, newExhibition])
    alert('Exhibition published!')
    setExhibitionForm({
      title: '',
      theme: '',
      culture: '',
      virtualTour: '',
      commentary: '',
      featured: false,
    })
  }

  const removeExhibition = (id) => {
    setExhibitions((prev) => prev.filter((item) => item.id !== id))
  }

  const removeArtwork = (id) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id))
  }

  const updateArtworkStatus = (id, newStatus) => {
    setArtworks((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
  }

  const changeUserRole = async (id, newRole) => {
    const previousUsers = users
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)))

    if (user?.role !== 'Admin') {
      return
    }

    try {
      await fetchAuthorized(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole.toUpperCase() }),
      })
    } catch (error) {
      setUsers(previousUsers)
      alert(error.message || 'Unable to update role right now')
    }
  }

  const handleCheckout = async () => {
    if (!checkoutForm.purchaserName || !checkoutForm.mobile || !checkoutForm.address || !checkoutForm.landmark) {
      setCheckoutError('Please fill all required fields')
      return
    }

    setCheckoutError('')

    const resetCheckoutState = () => {
      setCart([])
      setCheckoutForm({
        purchaserName: '',
        mobile: '',
        address: '',
        landmark: '',
        paymentMethod: 'UPI',
      })
      setTimeout(() => {
        setCheckoutSuccess('')
      }, 2000)
    }

    try {
      await fetchAuthorized('/checkout', {
        method: 'POST',
        body: JSON.stringify({
          ...checkoutForm,
          currency: 'INR',
        }),
      })
      recordCompletedSales(cartItems)
      setCheckoutSuccess('Order placed successfully! Your artworks will arrive shortly.')
      resetCheckoutState()
    } catch (error) {
      const isDemoUser = localStorage.getItem('token')?.startsWith('demo_token_')
      const isNetworkFailure = error.message?.toLowerCase().includes('unable to connect')

      if (isDemoUser && isNetworkFailure) {
        recordCompletedSales(cartItems)
        setCheckoutSuccess('Order placed in demo mode! Start backend to persist real orders.')
        resetCheckoutState()
        return
      }

      setCheckoutError(error.message || 'Checkout failed. Please try again.')
    }
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<About exhibitions={exhibitions} />} />
          <Route path="/about" element={<About exhibitions={exhibitions} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home exhibitions={exhibitions} />} />
          <Route path="/gallery" element={<Gallery />} />

          <Route
            path="/visitor"
            element={
              <ProtectedRoute requiredRole="Visitor">
                <VisitorDashboard
                  visitorTab={visitorTab}
                  setVisitorTab={setVisitorTab}
                  search={search}
                  setSearch={setSearch}
                  filterCulture={filterCulture}
                  setFilterCulture={setFilterCulture}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  filterArtist={filterArtist}
                  setFilterArtist={setFilterArtist}
                  cultures={cultures}
                  categories={categories}
                  artists={artists}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  filteredArtworks={filteredArtworks}
                  imageFallbackMap={imageFallbackMap}
                  handleImageError={handleImageError}
                  formatINR={formatINR}
                  setSelectedArtworkId={setSelectedArtworkId}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  cart={cart}
                  toggleCart={toggleCart}
                  approvedArtworks={approvedArtworks}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  selectedArtwork={selectedArtwork}
                  exhibitions={exhibitions}
                  checkoutForm={checkoutForm}
                  setCheckoutForm={setCheckoutForm}
                  checkoutError={checkoutError}
                  checkoutSuccess={checkoutSuccess}
                  handleCheckout={handleCheckout}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard
                  users={users}
                  changeUserRole={changeUserRole}
                  pendingArtworks={pendingArtworks}
                  updateArtworkStatus={updateArtworkStatus}
                  removeArtwork={removeArtwork}
                  transactions={dashboardTransactions}
                  formatINR={formatINR}
                  approvedArtworks={approvedArtworks}
                  totalRevenue={dashboardTotalRevenue}
                  approvedArtworksCount={dashboardApprovedCount}
                  activeUsersCount={dashboardActiveUsers}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/artist"
            element={
              <ProtectedRoute requiredRole="Artist">
                <ArtistDashboard
                  uploadForm={uploadForm}
                  setUploadForm={setUploadForm}
                  handleArtworkUpload={handleArtworkUpload}
                  artistArtworks={artistArtworks}
                  removeArtwork={removeArtwork}
                  imageFallbackMap={imageFallbackMap}
                  handleImageError={handleImageError}
                  formatINR={formatINR}
                  artistSales={artistSales}
                  artistRevenue={artistRevenue}
                  pendingArtworks={pendingArtworks}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/curator"
            element={
              <ProtectedRoute requiredRole="Curator">
                <CuratorDashboard
                  exhibitionForm={exhibitionForm}
                  setExhibitionForm={setExhibitionForm}
                  addExhibition={addExhibition}
                  removeExhibition={removeExhibition}
                  exhibitions={exhibitions}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/about" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}
