import React from 'react';

const Navbar = ({ darkMode }) => {
    // Apply styles based on dark mode
    const navbarStyle = darkMode
        ? 'bg-gray-900 text-white border border-solid border-white'
        : 'bg-gradient-to-r from-purple-800 to-blue-700 text-white';

    const hoverTextColor = darkMode ? 'hover:text-gray-400' : 'hover:text-yellow-300';

    return (
        <nav
            className={`sticky z-40 top-0 py-4 px-6 flex justify-between items-center shadow-lg ${navbarStyle}`}
        >
            <a href="#" className={`text-xl font-bold p-2 ${hoverTextColor}`}>
                <i className="fas fa-home  text-sm"></i> Home
            </a>
            <a
                href="https://imgflip.com/memetemplates?page=2"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-lg p-2 font-semibold ${hoverTextColor} hover:underline`}
            >
                Browse Templates
            </a>
        </nav>
    );
};

export default Navbar;
