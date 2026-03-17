const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomfinder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [String],
  images: [String],
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Room = mongoose.model('Room', roomSchema);

const sampleRooms = [
  {
    title: 'Cozy Studio Apartment',
    description: 'A comfortable studio apartment in the heart of downtown.',
    location: 'Downtown',
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Gym Access'],
    available: true
  },
  {
    title: 'Spacious 2BR Apartment',
    description: 'Modern 2-bedroom apartment with great views.',
    location: 'Uptown',
    price: 1800,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['WiFi', 'Parking', 'Balcony'],
    available: true
  },
  {
    title: 'Luxury Penthouse',
    description: 'Stunning penthouse with rooftop access.',
    location: 'Midtown',
    price: 3500,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ['WiFi', 'Concierge', 'Rooftop', 'Gym'],
    available: true
  },
  {
    title: 'Charming Cottage',
    description: 'Quaint cottage in a quiet neighborhood.',
    location: 'Suburb',
    price: 1500,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Garden', 'WiFi', 'Pet Friendly'],
    available: true
  }
];

const seedDatabase = async () => {
  try {
    await Room.deleteMany(); // Clear existing data
    await Room.insertMany(sampleRooms);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();