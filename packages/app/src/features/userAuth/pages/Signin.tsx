import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { SigninUser } from "../userTypes";
import { useAppDispatch } from "../../../app/hooks";
import { signout, userSignin } from "../userSlice";
import Base from "../../../base/Base";

const Signin: React.FC = () => {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<SigninUser>({
    username: "i_am_meanish",
    password: "admin@123456789",
  });
  const [shouldRedirect, setRedirect] = useState<Boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setUserData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resData = await dispatch(userSignin(userData));
      console.log(resData);
      setRedirect(true);
    } catch (error) {
      console.log(error);
      dispatch(signout());
    }
  };
  return (
    <Base className="flex flex-col items-center	 pt-20">
     {shouldRedirect && <Redirect to="/user/dashboard" />}
      <h1 className="text-center text-4xl mb-5 text-purple-800 font-bold">
        Sign In
      </h1>
      <form
        onSubmit={submitForm}
        className="bg-purple-300 p-8 rounded-lg w-72 xsm:w-96"
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
      {/* <button
        onClick={() => {
          dispatch(signout());
        }}
      >
        Sign Out
      </button> */}
       {shouldRedirect && <Redirect to="/user/dashboard" />}
    </Base>
  );
};

export default Signin;
