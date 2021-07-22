import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiFillNotification } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { BsPlusSquareFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "./../app/hooks";
import { selectUser, signout } from "../features/userAuth/userSlice";
import { FiLogOut } from "react-icons/fi";

interface Props {}

const MobileBottomNav: React.FC<Props> = () => {
  const history = useHistory();
  const { user } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [dropdownStyle, setDropdownStyle] = useState({
    display: "none",
  });

  const userSignout = () => {
    history.push("/signin")
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
      <nav className="bg-gray-900 px-10 py-3 fixed bottom-0 w-screen z-10">
        <ul className="flex flex-row justify-between ">
          <Link to="/notifications">
            <li className="text-white text-xs font-semibold sm:text-lg">
              <AiFillNotification size={28} />
            </li>
          </Link>
          <Link to="/user/newpost">
            <li className="text-white text-xs font-semibold sm:text-lg">
              <BsPlusSquareFill size={28} />
            </li>
          </Link>

          <div onClick={userClick}>
            {user && (
              <span
                style={dropdownStyle}
                className={` rounded-md flex flex-col items-center absolute z-20 px-2 py-3 bg-gray-800 right-5 bottom-14`}
              >
                <Link
                  to="/user/dashboard"
                  className="flex text-white font-bold mb-3"
                >
                  <span className="mt-1 mr-2">
                    <RiDashboardFill size={20} />
                  </span>
                  Dashboard
                </Link>
                <p
                  onClick={userSignout}
                  className="flex text-white font-bold cursor-pointer"
                >
                  <span className="mt-1 mr-2">
                    <FiLogOut size={20} />
                  </span>
                  Sign Out
                </p>
              </span>
            )}

            <li className="text-white text-xs font-semibold sm:text-lg cursor-pointer">
              <FaUserCircle size={28} />
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
};

export default MobileBottomNav;
