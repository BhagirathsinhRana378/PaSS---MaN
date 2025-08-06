import React from 'react'

const FOOTER = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 text-black py-6 text-center shadow-lg rounded-t-xl animate-fade-in mt-10">
      <div className="max-w-2xl mx-auto px-4">
        <h3 className="text-xl mb-1 flex items-center justify-center gap-1 text-white">
          Created With <span role="img" aria-label="love" className="animate-pulse">❤️‍🔥</span>
        </h3>
        <h2 className="text-xl font-extrabold mb-3 bg-gradient-to-r from-yellow-100 via-red-400 to-pink-700 bg-clip-text text-transparent">
          By Bhagirathsinh Rana
        </h2>
        <p className="text-sm text-white">
          Pass/--Man encrypts and stores your passwords locally on your device using advanced encryption. Your passwords never leave your computer, giving you complete control over your data.
        </p>
      </div>
    </footer>
  )
}

export default FOOTER