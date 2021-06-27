import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiFillNotification } from "react-icons/ai";
import { BsPlusSquareFill } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { FiLogOut } from "react-icons/fi";
import { useAppDispatch } from "../app/hooks";
import { signout } from "../features/userAuth/userSlice";
import JuneLogo from "../images/June.svg";
import styles from "./base.module.css";

interface Props {}

const DesktopNav: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const [shouldRedirect, setRedirect] = useState<Boolean>(false);
  const userSignout = () => {
    dispatch(signout());
    setRedirect(true);
  };

  const userClick = (e: any) => {
    console.log(e.target);
  };
  return (
    <nav className="bg-gray-900 px-10 py-3 fixed w-screen z-10">
      {shouldRedirect && <Redirect to="/signin" />}
      <ul className="flex justify-between items-center">
        <Link to="">
          <li className="mr-10 ">
            <img src={JuneLogo} alt="june" className="h-10" />
          </li>
        </Link>

        {/* Search bar */}
        <li className="flex-grow text-white text-xs  font-semibold sm:text-lg">
          <input
            type="text"
            placeholder="search your lost homie"
            className="text-sm p-1 w-9/12 rounded-sm"
          />
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
          <Link to="/user/dashboard" className={`${styles.user}`}>
            <li
              onClick={userClick}
              className={`relative text-white text-xs mx-5 font-semibold
             sm:text-lg `}
            >
              <FaUserCircle size={28} />
            </li>
            <span
              className={`shadow-md border rounded-md flex flex-col items-center absolute z-20 px-2 py-3 bg-white right-10 ${styles.dropdown}`}
            >
              <p onClick={userSignout} className="flex text-red-500 font-bold">
                <span className="mt-1 mr-2">
                  <FiLogOut size={20} />
                </span>
                Sign Out
              </p>
            </span>
          </Link>
        </span>
      </ul>
    </nav>
  );
};

export default DesktopNav;
