import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col items-center justify-center p-4">
        <div className="relative mb-2">
            <h1 className="text-[150px] font-light text-white leading-none relative z-10 font-[Inter]">
                4<span className="text-[#1e1e1e] mx-[-20px]">0</span>1
            </h1>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-tr from-[#1e1e1e] to-purple-600 blur-sm z-0 opacity-80"></div>
             
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#1e1e1e] z-0"></div>
          
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600 z-0"></div>
        </div>
      
        <div className="relative -mt-32 mb-12 flex items-center justify-center">
            <span className="text-[12rem] font-light text-gray-200">4</span>
            <div className="w-40 h-40 rounded-full bg-gradient-to-b from-[#2d2d2d] to-purple-600 mx-[-1rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/50 to-white/10 opacity-50"></div>
            </div>
            <span className="text-[12rem] font-light text-gray-200">1</span>
        </div>

      <h2 className="text-2xl md:text-3xl text-white font-light tracking-widest mb-10 text-center uppercase">
        Unauthorized Request
      </h2>

      <button
        onClick={() => navigate(-1)}
        className="px-12 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-md shadow-lg shadow-purple-900/30 transition-all transform hover:scale-105 uppercase text-sm tracking-wider font-medium"
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
