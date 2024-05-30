import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faSignOutAlt, faGear, faUser, faHeart, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "../styles/Dropdown.css";

const UserMenuDropdown = ({ uname }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState("auto");

  useEffect(() => {
    if (buttonRef.current) {
      setDropdownWidth(`${buttonRef.current.offsetWidth}px`);
    }
  }, [buttonRef.current]);

  return (
    <div className="mr-2 dropdown-container">
      <div className="button-container">
        <button
          ref={buttonRef}
          className={`${isHovered ? 'px-4' : ''} text-white font-bold hover:px-4 uppercase outline-none focus:outline-none ease-linear transition-all duration-150`}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          {uname}
          <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
        </button>
        <div
          className="dropdown-content text-base bg-white rounded-lg shadow-lg py-2 px-4"
          style={{ width: dropdownWidth }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
          <button
            className="hover:text-white text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              const username = localStorage.getItem("username");
              if (window.location.pathname !== `/${username}/profile`) {
                navigate(`/profile`, { replace: true });
              }
            }}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </button>
          <button
            className="hover:text-white text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/favorites`, { replace: true });
            }}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-2" />
            Favorites
          </button>
          <button
            className="hover:text-white text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              navigate('/settings');
            }}
          >
            <FontAwesomeIcon icon={faGear} className="mr-2" />
            Settings
          </button>
          <div className="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
          <button
            className="hover:text-white text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("firstName");
              navigate("/login", { replace: true });
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenuDropdown;
