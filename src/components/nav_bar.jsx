import React from 'react'

const nav_bar = () => {
    return (
        <nav className="bg-gradient-to-r from-gray-800 via-gray-400 to-gray-800 text-white px-8 py-5 flex justify-between items-center shadow-lg rounded-b-xl animate-fade-in">
            <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-extrabold text-center mb-4 tracking-tight">
                    <span className="text-black">&lt;</span>
                    <span className='text-white'>Pa</span>
                    <span className="text-green-500">S</span>
                    <span className="text-green-00">S</span>
                    <span className="text-black">/</span>
                    <span className="text-white">-</span>
                    <span className="text-black">-</span>
                    <span className="text-white">M</span>
                    <span className="text-pink-600">a</span>
                    <span className="text-white">N</span>
                    <span className="text-black">&gt;</span>
                </h1>

               
            </div>
            <ul className="flex space-x-8">
                <li>
                    <a
                        className="font-bold px-4 py-2 rounded-lg bg-black bg-opacity-10 hover:bg-opacity-30 transition-colors duration-200 shadow-md flex items-center gap-2"
                        href="https://github.com/Bhagirathsinhrana378"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.476 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        Github
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default nav_bar