import React from "react";
import { Link } from "react-router-dom";
import JuneLogo from "../images/June.svg";
import SearchBox from "./SearchBox";

interface Props {}

const MobileTopNav: React.FC<Props> = () => {
  return (
    <nav className="bg-gray-800 px-10 py-2 fixed w-screen z-10">
      <ul className="flex justify-evenly items-center">
        <Link to="/">
          <li className="mr-5">
            <img src={JuneLogo} alt="june" className="h-10" />
          </li>
        </Link>
        
        <SearchBox />
      </ul>
    </nav>
  );
};

export default MobileTopNav;
