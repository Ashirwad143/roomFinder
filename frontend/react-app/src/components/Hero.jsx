import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
];

function Hero() {

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center transition-all duration-1000"
      style={{
        backgroundImage: `url(${images[index]})`
      }}
    >

      {/* overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* content */}
      <div className="relative text-center text-white px-6">

        <h1 className="text-6xl font-bold mb-6">
          Find Your Perfect Room
        </h1>

        <p className="text-xl mb-8">
          Discover 1RK, 1BHK, 2BHK rentals near you
        </p>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 flex gap-3">

          <input
            className="p-3 rounded-lg outline-none w-64 text-black"
            placeholder="Enter City"
          />

          <button className="bg-indigo-600 text-white px-6 rounded-lg hover:bg-indigo-700 transition">
            Search
          </button>

        </div>

      </div>

    </div>
  );
}

export default Hero;