import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiFillNotification } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { BsPlusSquareFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, signout } from "../features/userAuth/userSlice";
import SearchBox from "./SearchBox";

interface Props {}

const DesktopNav: React.FC<Props> = () => {
  const history = useHistory();
  const { user } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [dropdownStyle, setDropdownStyle] = useState({
    display: "none",
  });
  const userSignout = () => {
    history.push("/signin");
    dispatch(signout());
  };

  const userClick = (e: any) => {
    setDropdownStyle(() => {
      return dropdownStyle.display === "none"
        ? { display: "block" }
        : { display: "none" };
    });
  };
  return (
    <>
      <nav className="bg-gray-900 px-10 py-3 fixed w-screen z-10">
        <ul className="flex justify-between items-center">
          <Link to="/">
            <li className="mr-10 font-bold text-white text-3xl ">JUNE</li>
          </Link>

          <SearchBox />

          <span className="flex justify-end">
            <Link to="/user/newpost">
              <li className="text-white text-xs mx-5 font-semibold sm:text-lg">
                <BsPlusSquareFill size={28} />
              </li>
            </Link>
            <Link to="/notifications">
              <li className="text-white text-xs mx-5 font-semibold sm:text-lg">
                <AiFillNotification size={28} />
              </li>
            </Link>
            <div>
              {user && (
                <span
                  style={dropdownStyle}
                  className={`bg-gray-800 mt-12 rounded-md flex flex-col items-center absolute z-20 px-2 py-3 right-10`}
                >
                  <Link
                    to="/user/dashboard"
                    className="flex mb-3 text-white font-bold"
                  >
                    <span className="mt-1 mr-2">
                      <RiDashboardFill size={20} />
                    </span>
                    Dashboard
                  </Link>
                  <p
                    onClick={userSignout}
                    className="flex cursor-pointer text-white font-bold"
                  >
                    <span className="mt-1 mr-2">
                      <FiLogOut size={20} />
                    </span>
                    Sign Out
                  </p>
                </span>
              )}

              <li
                onClick={userClick}
                className={`relative text-white text-xs mx-5 cursor-pointer font-semibold
             sm:text-lg `}
              >
                <FaUserCircle size={28} />
              </li>
            </div>
          </span>
        </ul>
      </nav>
    </>
  );
};

export default DesktopNav;
