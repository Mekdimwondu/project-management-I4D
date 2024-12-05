import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );
      const token = response.data.token;
      localStorage.setItem("User", token); // Store the JWT token
      navigate("/dashboard"); // Navigate to dashboard after login
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  // Function to handle "Forgot Password" click
  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Navigate to the password reset page
  };

  return (
    <section className="flex h-screen bg-gradient-to-l from-blue-600 via-blue-300 to-blue-50">
      <div className="w-full lg:w-2/4 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center">Login</h2>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray" size={20} />
                ) : (
                  <FaEye className="text-gray" size={20} />
                )}
              </div>
            </div>
            <div className="mt-4 text-right">
              <p
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </p>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Gradient Section */}
      <div className="hidden lg:block w-2/4 h-screen relative">
        <div className="absolute inset-0 flex flex-col my-40 mx-40 items-start justify-start space-y-16">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            IMPACT <br /> FOR <br /> DEVELOPMENT
          </h1>
          <div className="flex justify-center w-full">
            <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold leading-snug text-center">
              Empowering Change,
              <br /> Driving Progress
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
