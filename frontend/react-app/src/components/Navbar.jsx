import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/60 border-b border-gray-200 shadow-sm">
      <div className="w-full px-10 flex justify-between items-center px-8 py-4">

        {/* LOGO */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide cursor-pointer hover:scale-105 transition">
          RoomFinder
        </h1>

        {/* LINKS */}
        <div className="flex items-center gap-10 text-gray-700 font-medium">

          <Link className="relative group" to="/">
            Rooms
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link className="relative group" to="/my-rooms">
            My Rooms
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link className="relative group" to="/add-room">
            Add Room
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link className="relative group" to="/login">
            Login
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:scale-105 hover:shadow-lg transition duration-300"
          >
            Register
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;