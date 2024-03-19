import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DropdownRender from "./Dropdown";
import { useNavigate } from "react-router-dom";

export default function Navbar2({uname}) {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!searchValue) {
        navigate("/", { replace: true });
      } else {
        navigate(`/search/${searchValue}`);
      }
    }
  };

  return (
    <nav className="bg-zinc-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">ARTO</div>
          <div className="hidden md:flex space-x-6">
            <DropdownRender uname={uname} />
            <a href="/makeup" className="text-white font-bold hover:text-moonstone">MAKE-UP</a>
            <a href="/help" className="text-white font-bold hover:text-moonstone">HELP</a>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSearch} className='text-white leading-snug flex rounded-full bg-zinc-700 items-center rounded-r-none pl-2 py-1' />
              <input
                type="text"
                placeholder="Search"
                className="bg-zinc-700 text-white px-2 rounded focus:outline-none leading-snug rounded-full rounded-l-none flex-1 h-6 placeholder:text-light-orange"
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
