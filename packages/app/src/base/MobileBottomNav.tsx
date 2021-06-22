import React from "react";
import { Link } from "react-router-dom";
import {FaUserCircle} from "react-icons/fa";
import {AiFillNotification} from "react-icons/ai";
import {BsPlusSquareFill} from "react-icons/bs";
import {AiFillHome} from "react-icons/ai";

interface Props {}

const MobileBottomNav: React.FC<Props> = () => {
  return (
    <nav className="bg-purple-400 px-10 py-3 fixed bottom-0 w-screen">
      <ul className="flex flex-row justify-between ">
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">
            <AiFillHome size={28}/>
          </li>
        </Link>
        <Link to="/">
          <li  className="text-white text-xs font-semibold sm:text-lg">
            <BsPlusSquareFill size={28}/>
          </li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">
          <AiFillNotification size={28}/>

          </li>
        </Link>
        <Link to="/user/dashboard">
          <li className="text-white text-xs font-semibold sm:text-lg">
          <FaUserCircle size={28}/>

          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
