import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { SigninUser } from "../userTypes";
import { useAppDispatch } from "../../../app/hooks";
import { signout, userSignin } from "../userSlice";
import gradient from "../../../images/gradient.png";
const Signin: React.FC = () => {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<SigninUser>({
    username: "",
    password: "",
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
      await dispatch(userSignin(userData));
      setRedirect(true);
    } catch (error) {
      console.log(error);
      dispatch(signout());
    }
  };
  return (
    <div
      className="flex flex-col items-center pt-20 "
      style={{
        background: `url(${gradient}) center center no-repeat`,
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      {shouldRedirect && <Redirect to="/user/dashboard" />}

      <form
        onSubmit={submitForm}
        className="bg-purple-300 p-8 rounded-lg w-72 xsm:w-96 "
      >
        <h1 className=" text-center font-bold text-4xl mb-5 text-purple-600  ">
          Sign In
        </h1>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={userData.username}
          onChange={handleChange}
          className="p-1 mb-3 rounded-md w-full "
        />
        <br />
        <input
          type="password"
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
        <p className="text-center text-white mt-3">
          New here?
          <Link to="/signup" className="text-purple-700 font-bold ml-2	">
            Sign Up
          </Link>
        </p>
      </form>

      {shouldRedirect && <Redirect to="/user/dashboard" />}
    </div>
  );
};

export default Signin;
