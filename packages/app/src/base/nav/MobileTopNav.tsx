import React from "react";
import { Link } from "react-router-dom";
import SearchBox from "../SearchBox";

const MobileTopNav: React.FC = () => {
  return (
    <nav className="bg-gray-900 px-10 py-2 fixed w-screen z-10">
      <ul className="flex justify-evenly items-center">
        <Link to="/">
        <li className="mr-10 font-bold text-white text-3xl ">
             JUNE
            </li>
        </Link>
        
        <SearchBox />
      </ul>
    </nav>
  );
};

export default MobileTopNav;
