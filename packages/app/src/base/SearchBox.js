import React, { useState } from "react";
import { useSelector } from "react-redux";
import { fetchAllUsers, selectUser } from "../features/userAuth/userSlice";
import { Image } from "cloudinary-react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "./../app/hooks";

let timerId;
const debounceFunc = (func, delay) => {
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    func();
  }, delay);
};

const SearchBox = () => {
  const { allUsers } = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchInput(query);

    const search = () => {
      if (allUsers) {
        const queryData = allUsers.filter((item) => {
          return item.username.toLowerCase().includes(query.toLowerCase());
        });
        setFilteredUsers(queryData);
      }
    };
    debounceFunc(search, 500);
  };

  const handleClick = async () => {
    try {
      !allUsers && (await dispatch(fetchAllUsers()));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="relative flex-grow  text-xs  font-semibold sm:text-lg">
      <input
        type="text"
        placeholder="search your lost homie"
        className="text-sm p-1 w-full rounded-sm sm:w-10/12"
        value={searchInput}
        onChange={handleChange}
        onClick={handleClick}
      />
      <span className="absolute top-11 -left-0 w-full overflow-y-auto max-h-64 ">
        {searchInput &&
          filteredUsers &&
          filteredUsers.map((person) => (
            <Link
              onClick={() => {
                setSearchInput("");
              }}
              to={`/person/${person.username}`}
              key={person._id}
              className=" flex bg-gray-100 px-5 py-2  hover:bg-gray-200"
            >
              <Image
                cloudName="june-social"
                publicId={person.profile_photo}
                width="30"
                height="30"
                responsiveUseBreakpoints="true"
                crop="fill"
                radius="max"
              />
              <p className="mt-1 ml-2">{person.username}</p>
            </Link>
          ))}
        {/* {searchInput && !filteredUsers && (
          <div className="flex  border border-t-0 border-green-400 bg-white px-5 py-2  hover:bg-purple-200">
            No users found!
          </div>
        )} */}
        {/* todo: check this */}
      </span>
    </li>
  );
};

export default SearchBox;
