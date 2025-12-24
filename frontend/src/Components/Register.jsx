

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Form submitted:', formData);

    try {
      fetch('/api/createUser', {
          method : 'POST',
          body : JSON.stringify(formData),
          headers : {
            'Content-Type' : 'application/json'
          }

      })
      .then(result => result.json())
      .then(data => {
        if (data.status) {
          // alert(data.message)
          setFormData({ username: '', email: '', password: '', confirmPassword: '', })
          console.log(data.message)
          return
        } 
      })

    }
    catch(err) {
      console.error(`Something went wrong while registering... ${err.message}`)
    }
  
  };
  
    return(
      <div className="flex items-center justify-center h-screen bg-gray-900">
      <div>
        <h1 className="text-5xl font-bold mt-10 mb-6 text-center">
          <span className="text-white">MANGA</span>
          <span className="text-yellow-300">VERSE</span>
        </h1>
        <div className="bg-black p-20 rounded-lg shadow-lg text-center">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <h1 className="text-4xl font-bold mb-1 text-white">
                Create Your Account
              </h1>
            </div>
            <div>
              <label htmlFor="username" className="block text-xl font-medium text-white text-left">
                Username:
              </label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} 
              className="mt-1 w-full px-2 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-white text-left">
                Email:
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} 
              className="mt-1 w-full px-2 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-xl font-medium text-white text-left">
                Password: <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} 
              className="mt-1 w-full px-2 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300" required />
              </label>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xl font-medium text-white text-left">
                Confirm Password: <input type="password" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} 
              className="mt-1 w-full px-2 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300" required />
              </label>
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-yellow-300 text-gray-800 font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300">
              Sign Up
            </button>
            <p className="text-sm text-white">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-300 hover:underline">
                 Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    );
}
