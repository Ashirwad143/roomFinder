import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/");
      

    } catch {
      alert("Login Failed");
    }
  };

  return (
    <div className="h-screen flex">

      {/* LEFT IMAGE */}
      <div
        className="w-1/2 bg-cover bg-center hidden md:block"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1502672260266-1c1ef2d93688)"
        }}
      ></div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">

        <form
          onSubmit={handleLogin}
          className="bg-white/20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 text-white"
        >

          <h2 className="text-4xl font-bold mb-8 text-center">
            Welcome Back
          </h2>

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

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 transition duration-300 shadow-lg">
            Login
          </button>

            <p className="text-center mt-6 text-sm">
                Don’t have account?{" "}
                <Link to="/register" className="font-semibold underline">
                    Register
                </Link>
            </p>

        </form>

      </div>

    </div>
  );
}

export default Login;