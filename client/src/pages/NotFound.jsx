import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-gray-700 text-center mb-6">
          The page you are looking for does not exist.
        </p>
        <div className="text-center">
          <button
            onClick={handleGoHome}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
