import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/login', formData);
      localStorage.setItem('token', data.token);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2">
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-10">
          <img src="/logo-project.png" alt="Ubiquitous Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <div className="text-gray-400">ubiquitous.co</div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Log In</h2>
        <p className="text-gray-400 text-center mb-8">Enter your details to access your account</p>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#1e1e1e] relative">
            <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">Email Address</label>
            <input
              name="username"
              type="text"
              placeholder="Enter Your Email Address"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div className="bg-[#1e1e1e] relative">
            <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-purple-900/20 mt-4"
          >
            LOG IN
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/signup" className="text-purple-400 hover:text-purple-300">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
