import React from "react";
import { Link } from "react-router-dom";

interface Props {}

const DesktopNav: React.FC<Props> = () => {
  return (
    <nav className="bg-purple-400 px-10 py-3 fixed w-screen">
      <ul className="flex flex-row justify-between">
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">June</li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">
            Search
          </li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">
            Messages
          </li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">
            New Post
          </li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">
            Notification
          </li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">User</li>
        </Link>
      </ul>
    </nav>
  );
};

export default DesktopNav;
