import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the email is correctly passed via location.state
  const email = location.state?.email;
  if (!email) {
    setError("Email not provided. Please go back and request a new code.");
    return null;
  }

  const handleVerifyCode = async (event) => {
    event.preventDefault();

    try {
      // Log the email and code to check if they are being passed correctly
      console.log("Email:", email);
      console.log("Code:", code);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-code`,
        { email, code }
      );

      // Check the response for success status
      console.log("Response:", response.data);
      if (response.status === 200) {
        // Navigate to reset-password page with the email
        navigate("/resetPassword", { state: { email } });
      } else {
        setError("Invalid response. Please try again.");
      }
    } catch (err) {
      // Check the actual error response
      console.error(
        "Verification error:",
        err.response ? err.response.data : err.message
      );
      setError("Invalid code. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">
          Enter Verification Code
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            placeholder="Enter 4-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
            maxLength={4}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyCode;
