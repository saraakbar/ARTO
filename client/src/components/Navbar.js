import React from 'react';

function Navbar() {

  return (
    <nav className="bg-zinc-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">ARTO</div>
          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-white font-bold">ABOUT</a>
            <a href="/login" className="text-white font-bold">LOGIN</a>
            <a href="/register" className="text-white font-bold">REGISTER</a>
          </div>
        </div>
      </div>
    </nav>
  );

}

export default Navbar;