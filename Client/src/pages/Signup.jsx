import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Eye, EyeOff, ArrowLeft, ChevronDown } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Client', name: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (pwd) => {
    return pwd.length >= 8;
  };

  const PasswordStrength = (pwd) => {
    if (pwd.length < 4) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (pwd.length < 8) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    return { label: 'Very Good', color: 'bg-purple-500', width: '100%' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters');
      return;
    }
    try {
      await api.post('/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const strength = PasswordStrength(formData.password);



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

        <h2 className="text-2xl font-bold text-white text-center mb-2">Sign Up</h2>
        <p className="text-gray-400 text-center mb-8">Enter the below details to sign up</p>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="bg-[#1e1e1e] relative">
            <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="bg-[#1e1e1e] relative">
            <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">Email</label>
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
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
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
            
            {/* Password Popup */}
            {passwordFocus && (
              <div className="absolute left-[105%] top-0 w-64 bg-white text-gray-900 p-4 rounded-lg shadow-xl z-20 pointer-events-none before:content-[''] before:absolute before:left-[-6px] before:top-6 before:w-3 before:h-3 before:bg-white before:rotate-45">
                 <h4 className="font-bold text-sm mb-2">Password Strength: <span className="font-normal">{strength.label}</span></h4>
                 <div className="h-1.5 w-full bg-gray-200 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                 </div>
                 <p className="text-xs text-gray-600 leading-relaxed">
                   Use at least 8 characters. Password is case sensitive. Don't use password from another site, or something too obvious.
                 </p>
              </div>
            )}
          </div>

          <div className="bg-[#1e1e1e] relative">
            <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">User Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="Client" className="bg-[#1e1e1e] text-white py-2">Client</option>
              <option value="Admin" className="bg-[#1e1e1e] text-white py-2">Admin</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-purple-900/20 mt-4"
          >
            SIGN UP
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
