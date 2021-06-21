import React, { useState } from "react";
import Base from "./../../base/Base";
import { Link } from "react-router-dom";
import { SigninUser } from "./userTypes";

const Signin: React.FC = () => {
  const [userData, setUserData] = useState<SigninUser>({
    username: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setUserData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };
  const submitForm = () => {};
  return (
    <Base className="flex flex-col items-center	 pt-20">
      <h1 className="text-center text-4xl mb-5 text-purple-800 font-bold">
        Sign In
      </h1>
      <form
        onSubmit={submitForm}
        className="bg-purple-300 p-8 rounded-lg w-max xsm:w-96"
      >
        <input
          type="text"
          name="username"
          placeholder="username"
          value={userData.username}
          onChange={handleChange}
          className="p-1 mb-3 rounded-md w-full"
        />
        <br />
        <input
          type="text"
          name="password"
          placeholder="password"
          value={userData.password}
          onChange={handleChange}
          className="p-1 mb-3 rounded-md w-full"
        />
        <br />
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full text-white p-1 rounded-md bg-purple-500 hover:bg-purple-400 "
          >
            Sign In
          </button>
        </div>
      </form>
      <p>
        New here?{" "}
        <Link to="/signup" className="text-purple-700 font-bold	">
          Sign Up
        </Link>
      </p>

    </Base>
  );
};

export default Signin;
