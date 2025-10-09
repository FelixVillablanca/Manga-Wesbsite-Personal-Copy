import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/style.css'; // Assuming this is the correct path

export default function Login() {

  const navigateTo = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (data.status) {

        console.log(data.message)

        localStorage.setItem("userCredentials", data.Token) //parsing the the credentials of the user from the database with token added
        //and decoding it in /home so i can access the credentials of the user, and show it in UI
        navigateTo('/home')
      }

      // Handle successful login (e.g., store token, redirect)
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div>
        <h1 className="text-5xl font-bold mt-10 mb-6 text-center">
          <span className="text-white">MANGA</span>
          <span className="text-yellow-300">VERSE</span>
        </h1>
        <div className="bg-black p-20 rounded-lg shadow-lg text-center">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <h1 className="text-4xl font-bold mb-10 text-white">
                Log In to Your Account
              </h1>
            </div>
            <div>
              <label htmlFor="username" className="block text-xl font-medium text-white text-left">
                Username or Email:
              </label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 w-full px-2 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xl font-medium text-white text-left">
                Password:
              </label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 w-full px-2 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                required
              />
            </div>
            <div className="flex items-center justify-start">
              <input type="checkbox" id="remember" name="remember" checked={formData.remember} onChange={handleChange}
                className="h-4 w-4 text-yellow-300 focus:ring-yellow-300 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-white">
                Remember me
              </label>
            </div>
            <button type="submit" 
            className="w-full py-2 px-4 bg-yellow-300 text-gray-800 font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300">
              Log In
            </button>
            <p className="text-sm text-white">
              Don’t have an account?{' '}
              <Link
                to="/register" // recent '/'
                className="text-yellow-300 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}