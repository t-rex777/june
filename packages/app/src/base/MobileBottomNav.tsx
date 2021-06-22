import React from "react";
import { Link } from "react-router-dom";
interface Props {}

const MobileBottomNav: React.FC<Props> = () => {
  return (
    <nav className="bg-purple-400 px-10 py-3 fixed bottom-0 w-screen">
      <ul className="flex flex-row justify-between ">
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">Home</li>
        </Link>
        <Link to="/">
          <li  className="text-white text-xs font-semibold sm:text-lg">New post</li>
        </Link>
        <Link to="/">
          <li className="text-white text-xs font-semibold sm:text-lg">Notification</li>
        </Link>
        <Link to="/user/dashboard">
          <li className="text-white text-xs font-semibold sm:text-lg">User</li>
        </Link>
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
