import React from "react";
import { Link } from "react-router-dom";
import {FaUserCircle} from "react-icons/fa";
import {AiFillNotification} from "react-icons/ai";
import {BsPlusSquareFill} from "react-icons/bs";
import {TiMessages} from "react-icons/ti";
import JuneLogo from "../images/June.svg"


interface Props {}

const DesktopNav: React.FC<Props> = () => {
  return (
    <nav className="bg-purple-400 px-10 py-3 fixed w-screen">
      <ul className="flex justify-between items-center">
        <Link to="">
          <li className="mr-10 ">
            <img src={JuneLogo} alt="june" className="h-10" />
          </li>
        </Link>

        {/* Search bar */}
          <li className="flex-grow text-white text-xs  font-semibold sm:text-lg">
            <input type="text" placeholder="search your lost homie" className="text-sm p-1 w-9/12 rounded-sm" />
          </li>

        <span className="flex justify-end">
        <Link to="/">
          <li className="text-white text-xs mx-5 font-semibold sm:text-lg">
            <TiMessages size={28} /> 
            {/* todo: add counts */}
          </li>
        </Link>
        <Link to="/user/newpost">
          <li className="text-white text-xs mx-5 font-semibold sm:text-lg">
          <BsPlusSquareFill size={28} />
          </li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs mx-5 font-semibold sm:text-lg">
         <AiFillNotification size={28} />
          </li>
        </Link>
        <Link to="/user/dashboard">
          <li className="text-white text-xs mx-5 font-semibold sm:text-lg">
          <FaUserCircle size={28} />
          </li>
        </Link></span>
        
      </ul>
    </nav>
  );
};

export default DesktopNav;
