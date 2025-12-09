import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Eye, EyeOff, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { getUserRole, getUsername } from '../utils/auth';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();
  const [selectedProject, setSelectedProject] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Create User Modal State
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'Client' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [confirmingProject, setConfirmingProject] = useState(null); // stores project ID when user clicks to request
    
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return pwd.length >= 8;
  };

  const djangoPasswordStrength = (pwd) => {
    if (pwd.length < 4) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (pwd.length < 8) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    return { label: 'Very Good', color: 'bg-purple-500', width: '100%' };
  };

  const strength = djangoPasswordStrength(newUser.password);

  const fetchData = async () => {
    try {
      const response = await axios.get('/projects');
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestAccess = async (projectId) => {
    if (!projectId) return;
    try {
      await axios.post('/requestAccess', { projectId });
      toast.success('Access requested successfully');
      setConfirmingProject(null); 
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  const handleApproveDeny = async (requestId, status) => {
    try {
      await axios.post('/handleRequest', { requestId, status });
      toast.success(`Request ${status} successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleCreateUser = async (e) => {
     e.preventDefault();
     if (!validatePassword(newUser.password)) {
        toast.error('Password must be at least 8 characters');
        return;
     }

     try {
       await axios.post('/signup', newUser);
       toast.success('User created successfully');
       setIsCreateUserModalOpen(false);
       setNewUser({ name: '', username: '', password: '', role: 'Client' });
       fetchData();
     } catch (error) {
       toast.error(error.response?.data?.message || 'Error creating user');
     }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  const username = getUsername();

  // ADMIN VIEW
  if (role === 'Admin') {
    return (
      <div className="space-y-10">
        <Toaster position="top-right" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hi {username}! 👋</h1>
            <p className="text-gray-400">Let's monitor the product wise usage</p>
          </div>
          <button 
            onClick={() => navigate('/create-project')}
            className="border border-[#404040] hover:bg-[#333] px-4 py-2 rounded text-sm text-gray-300 transition-colors"
          >
            Create Project
          </button>
        </div>

   
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.projects?.map(project => (
            <div key={project._id} className="bg-[#2d2d2d] rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl md:text-3xl font-light mb-4 md:mb-6 break-words">{project.name}</h3>
              <div className="space-y-3 text-sm text-gray-400">

                <p><span className="text-gray-500">Contact :</span> <span className="text-white font-medium">{project.phone}</span></p>
                <p><span className="text-gray-500">Email :</span> <span className="text-white font-medium">{project.email}</span></p>
                <p><span className="text-gray-500">Start Date :</span> <span className="text-white font-medium">{new Date(project.startDate).toLocaleDateString()}</span></p>
                <p><span className="text-gray-500">End Date :</span> <span className="text-white font-medium">{new Date(project.endDate).toLocaleDateString()}</span></p>
              </div>
            </div>
          ))}
        </div>

   
        <div className="border border-[#404040] rounded-xl p-4 md:p-6">
          <h3 className="text-lg font-medium mb-4">Pending Requests</h3>
          {data?.requests?.length > 0 ? (
            <div className="space-y-4">
              {data.requests.map(req => (
                <div key={req._id} className="flex flex-col md:flex-row items-center justify-between text-sm py-2 gap-4">
                  <span className="text-gray-400">
                    <span className="text-white font-medium">{req.client?.username}</span> - requesting access to {req.project?.name}
                  </span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleApproveDeny(req._id, 'Approved')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      [ Grant Access ]
                    </button>
                    <button 
                      onClick={() => handleApproveDeny(req._id, 'Denied')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      [ Deny Access ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm italic">
               No pending requests
            </div>
          )}
        </div>

        {/* User Table */}
        <div className="bg-[#232323] rounded-xl p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium invisible">Users</h3> 
            <button 
              onClick={() => setIsCreateUserModalOpen(true)} 
              className="border border-[#404040] hover:bg-[#333] px-4 py-2 rounded text-sm text-gray-300"
            >
              Create User
            </button>
          </div>
          
          {/* Pagination Logic */}
          {(() => {
            const users = data?.users || [];
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
            const totalPages = Math.ceil(users.length / itemsPerPage);

            return (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                  <thead>
                    <tr className="text-gray-500 border-b border-[#333]">
                      <th className="pb-4 font-medium">Name</th>
                      <th className="pb-4 font-medium pl-4 border-l border-[#333]">Email</th>
                      <th className="pb-4 font-medium pl-4 border-l border-[#333]">Role</th>
                      <th className="pb-4 font-medium pl-4 border-l border-[#333]">Created Date</th>
                      <th className="pb-4 font-medium pl-4 border-l border-[#333]">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {currentUsers.map(user => (
                      <tr key={user._id} className="group hover:bg-[#2a2a2a]">
                        <td className="py-4 text-gray-300 group-hover:text-white capitalize">{user.name || user.username.split('@')[0]}</td>
                        <td className="py-4 pl-4 border-l border-[#333] text-gray-300 group-hover:text-white">{user.username}</td>
                        <td className="py-4 pl-4 border-l border-[#333] text-gray-300 group-hover:text-white">{user.role}</td>
                        <td className="py-4 pl-4 border-l border-[#333] text-gray-300 group-hover:text-white">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 pl-4 border-l border-[#333]">
                          <button className="border border-[#404040] hover:bg-[#404040] text-gray-400 hover:text-white px-3 py-1 rounded text-xs transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                  <span>Rows per page: {itemsPerPage}</span>
                  <div className="flex gap-2 items-center">
                     <span>{users.length === 0 ? '0-0' : `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, users.length)}`} of {users.length}</span>
                     <button 
                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                       disabled={currentPage === 1}
                       className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-1"
                     >
                        &lt;
                     </button>
                     <button 
                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                       disabled={currentPage === totalPages}
                       className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-1"
                     >
                        &gt;
                     </button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Create User Modal */}
        {isCreateUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
              <button 
                onClick={() => setIsCreateUserModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-white text-center mb-8">Create User</h2>
              
              <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="bg-[#1e1e1e] relative">
                    <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">Name</label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Enter Name"
                      className="w-full bg-transparent border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="bg-[#1e1e1e] relative">
                    <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">Email</label>
                    <input
                      type="email"
                      required
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="Enter Email"
                      className="w-full bg-transparent border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="bg-[#1e1e1e] relative">
                    <label className="absolute -top-2.5 left-3 bg-[#1e1e1e] px-1 text-xs text-gray-400 z-10">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        placeholder="Enter Password"
                        className="w-full bg-transparent border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 transition-colors"
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
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
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
                    CREATE USER
                  </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CLIENT VIEW
  return (
    <div className="space-y-10">
      <Toaster position="top-right" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
      />
      <h1 className="text-3xl font-bold mb-2">Hi {username}! 👋</h1>
      
      {data?.projects?.length === 0 ? (
        <p className="text-gray-400">
          You don't have access to any projects at the moment. Please request the same by clicking on the button below.
        </p>
      ) : (
        <p className="text-gray-400">Let's monitor the product wise usage</p>
      )}

      {/* Request Access Section */}
      <div className="relative inline-block w-full max-w-sm">
         <div className="bg-[#2d2d2d] rounded-lg flex flex-col gap-4 p-4">
             {/* Custom Dropdown Trigger */}
             <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors"
             >
                <span>Request Access</span>
                <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
             </button>

             {/* Dropdown Content */}
             {isDropdownOpen && (
                <div className="bg-[#363636] rounded-lg mt-1 p-2 space-y-1 relative">
                  {(() => {
                    const requestedProjectIds = new Set(data?.myRequests?.map(req => req.project?._id || req.project));
                    const availableToRequest = data?.availableProjects?.filter(p => !requestedProjectIds.has(p._id));
                    
                    if (!availableToRequest || availableToRequest.length === 0) {
                        // User Request: headline also incluee there is nothing to show
                       return <div className="text-gray-400 text-sm p-2 text-center">Nothing to show</div>;
                    }

                    return availableToRequest.map(p => (
                       <div key={p._id} className="relative group">
                          <button
                            onClick={() => setConfirmingProject(confirmingProject === p._id ? null : p._id)}
                            className={`w-full text-left px-4 py-3 rounded text-sm transition-colors flex justify-between items-center ${confirmingProject === p._id ? 'bg-[#444] text-white' : 'text-gray-300 hover:bg-[#444] hover:text-white'}`}
                          >
                             {p.name}
                          </button>

                          {/* Confirmation Popup (Tooltip Style) */}
                          {confirmingProject === p._id && (
                             <div className="absolute left-[105%] top-1/2 -translate-y-1/2 w-48 bg-[#333] border border-[#444] p-3 rounded-lg shadow-xl z-20 before:content-[''] before:absolute before:left-[-6px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-[#333] before:border-l before:border-b before:border-[#444] before:rotate-45">
                                 <p className="text-xs text-gray-300 mb-2 text-center">Are you sure?</p>
                                 <div className="flex gap-2 justify-center">
                                    <button 
                                      onClick={() => handleRequestAccess(p._id)}
                                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded"
                                    >
                                      [ Yes ]
                                    </button>
                                    <button 
                                      onClick={() => setConfirmingProject(null)}
                                      className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded"
                                    >
                                      [ No ]
                                    </button>
                                 </div>
                             </div>
                          )}
                       </div>
                    ));
                  })()}
                </div>
             )}

            {/* Pending Requests Status */}
            {data?.myRequests?.filter(req => req.status === 'Pending').length > 0 && (
              <div className="space-y-2 mt-2 border-t border-[#404040] pt-4">
                <h4 className="text-sm text-gray-400 font-medium">Request pending approvals:</h4>
                {data.myRequests
                  .filter(req => req.status === 'Pending')
                  .map(req => (
                  <div key={req._id} className="text-sm text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded border border-yellow-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Project <span className="font-semibold text-yellow-400">{req.project?.name}</span> is in request mode
                  </div>
                ))}
              </div>
            )}
         </div>
      </div>

  
       {data?.projects?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map(project => (
              <div key={project._id} className="bg-[#2d2d2d] rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl md:text-3xl font-light mb-4 md:mb-6 break-words">{project.name}</h3>
                <div className="space-y-3 text-sm text-gray-400">

                  <p><span className="text-gray-500">Contact :</span> <span className="text-white font-medium">{project.phone}</span></p>
                  <p><span className="text-gray-500">Email :</span> <span className="text-white font-medium">{project.email}</span></p>
                  <p><span className="text-gray-500">Start Date :</span> <span className="text-white font-medium">{new Date(project.startDate).toLocaleDateString()}</span></p>
                  <p><span className="text-gray-500">End Date :</span> <span className="text-white font-medium">{new Date(project.endDate).toLocaleDateString()}</span></p>
                </div>
              </div>
            ))}
          </div>
       )}
    </div>
  );
};

export default Dashboard;
