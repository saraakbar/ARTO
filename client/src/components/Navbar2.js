import React from 'react';
import DropdownRender from "./Dropdown";

export default function Navbar2({uname}) {
  return (
    <nav className="bg-zinc-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="ml-20 text-white font-bold text-xl">ARTO</div>
          <div className="hidden md:flex space-x-6 mr-20">
            <DropdownRender uname={uname} />
            <a href="/makeup" className="text-white font-bold">MAKE-UP</a>
            <a href="/help" className="text-white font-bold ">HELP</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
