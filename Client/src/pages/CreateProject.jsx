import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api';
import { ArrowLeft, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: ''
  });
  
  const handleChange = (e) => {
    if (e.target.name === 'phone') {
      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
      if (value.length <= 10) {
        setFormData({ ...formData, phone: value });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    try {
      await axios.post('/createProject', formData);
      toast.success('Project created successfully');
      setTimeout(() => navigate('/projects'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating project');
    }
  };

  return (
    <div className="max-w-2xl">
      <Toaster position="top-right" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
      />
      <div className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </div>

      <h1 className="text-2xl font-bold mb-8 text-white">Create Project</h1>

      <form onSubmit={handleSubmit} className="bg-[#2d2d2d] rounded-xl p-8 space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Project Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter First Name" 
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#363636] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#363636] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Contact Number</label>
            <input
              name="phone"
              type="text"
              placeholder="Enter contact number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-[#363636] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm text-gray-400 mb-1">Timeline</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="relative">
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#363636] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500 pr-10"
                />
             </div>
             <div className="relative">
                <input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#363636] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500 pr-10"
                />
             </div>
           </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors mt-4 shadow-lg shadow-purple-900/20"
        >
          Create Project
        </button> 
       
      </form>
    </div>
  );
};

export default CreateProject;
