import React from "react";
import { Link } from "react-router-dom";
import { TiMessages } from "react-icons/ti";
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

        {/* <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">
          <TiMessages size={28}/>

          </li>
        </Link> */}
      </ul>
    </nav>
  );
};

export default MobileTopNav;
