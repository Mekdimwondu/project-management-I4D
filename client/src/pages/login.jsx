import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
  
      // Assuming the token is returned in response.data.token
      const token = response.data.token;
      localStorage.setItem('User', token); // Store the JWT token
  
      console.log('Login successful:', response); // Debug log
  
      // Navigate to the dashboard after successful login
      navigate('/dashboard'); // Ensure this path matches your router setup
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message); // Debug log
      setError('Invalid credentials'); // Display error to the user
    }
  };
  

  return (
    <section className="flex h-screen">
      <div className="w-2/4 bg-white flex items-center justify-center">
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
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mt-4 text-right">
              <p className="text-blue-500 cursor-pointer hover:underline">Forgot password?</p>
            </div>
            <button type="submit" className="w-full mt-6 bg-blue2 text-white py-3 rounded hover:bg-blue transition duration-200">
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="w-2/4 h-screen relative">
        <img className="w-full h-full object-cover" src="src/assets/Rectangle 18.png" alt="img" />
        <div className="absolute inset-0 flex flex-col my-40 mx-40 items-start justify-start space-y-16">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
            IMPACT <br /> FOR <br /> PROGRAM
          </h1>
          <div className="flex justify-center w-full">
            <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold leading-snug text-center">
              Empowering Change,<br /> Driving Progress
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
