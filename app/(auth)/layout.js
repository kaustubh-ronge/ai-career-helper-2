import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#050505] overflow-hidden selection:bg-indigo-500/30">
      
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* 1. Base Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-[#050505] to-[#050505] pointer-events-none" />

      {/* 2. Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 3. Animated Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Optional: Add a logo here if you want it above the form */}
        {/* <div className="mb-8 text-center">
             <h1 className="text-2xl font-bold text-white tracking-tight">CivicCoach</h1>
        </div> */}
        
        {children}
      </div>

    </div>
  )
}

export default AuthLayout