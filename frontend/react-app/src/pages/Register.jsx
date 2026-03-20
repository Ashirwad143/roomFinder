import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role }
      );

      alert("Registered Successfully");

      navigate("/login");

    } catch {
      alert("Registration Failed");
    }
  };

  return (
    <div className="h-screen flex">

      {/* IMAGE SIDE */}
      <div
        className="w-1/2 bg-cover bg-center hidden md:block"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2)"
        }}
      ></div>

      {/* FORM SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">

        <form
          onSubmit={handleRegister}
          className="bg-white/20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 text-white"
        >

          <h2 className="text-4xl font-bold mb-8 text-center">
            Create Account
          </h2>

          <input
            className="w-full p-3 mb-4 rounded-lg bg-white/30 placeholder-white outline-none focus:bg-white/40 transition"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 mb-4 rounded-lg bg-white/30 placeholder-white outline-none focus:bg-white/40 transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-6 rounded-lg bg-white/30 placeholder-white outline-none focus:bg-white/40 transition"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ⭐ ROLE TOGGLE */}
          <div className="flex mb-6 bg-white/20 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setRole("seeker")}
              className={`flex-1 p-2 transition ${
                role === "seeker"
                  ? "bg-white text-indigo-600 font-semibold"
                  : "text-white"
              }`}
            >
              User
            </button>

            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`flex-1 p-2 transition ${
                role === "owner"
                  ? "bg-white text-indigo-600 font-semibold"
                  : "text-white"
              }`}
            >
              Owner
            </button>
          </div>

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 transition duration-300 shadow-lg">
            Register
          </button>

          <p className="text-center mt-6 text-sm">
            Already have account?{" "}
            <Link to="/login" className="font-semibold underline">
              Login
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}

export default Register;