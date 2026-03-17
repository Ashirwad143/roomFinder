import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [rooms, setRooms] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchRooms = async (location = '') => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/rooms?location=${location}`)
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRooms(searchTerm)
  }

  return (
    <div className="app">
      <header>
        <h1>Room Finder</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading rooms...</div>
        ) : (
          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room._id} className="room-card">
                <h3>{room.title}</h3>
                <p className="location">{room.location}</p>
                <p className="price">${room.price}/month</p>
                <div className="details">
                  <span>{room.bedrooms} bed</span>
                  <span>{room.bathrooms} bath</span>
                </div>
                <p className="description">{room.description}</p>
                {room.amenities && room.amenities.length > 0 && (
                  <div className="amenities">
                    {room.amenities.map(amenity => (
                      <span key={amenity} className="amenity">{amenity}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
