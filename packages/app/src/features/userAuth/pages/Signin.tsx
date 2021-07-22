import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { SigninUser } from "../userTypes";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUserData, signout, userSignin } from "../userSlice";
import gradient from "../../../images/gradient1.webp";
import GoogleButton from "react-google-button";
import { API } from "../../../API";
import { useEffect } from "react";
import { setJuneHeader } from "../../../utils";
import { selectUser } from "./../userSlice";
import Loader from "../../../base/Loader";
import useToast from "./../../../base/Toast";

const Signin: React.FC = () => {
  const { userStatus } = useAppSelector(selectUser);
  const { ToastComponent, setToast } = useToast();
  const history = useHistory();
  const { search } = useLocation();
  const dispatch = useAppDispatch();
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
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.username === "" || userData.password === "") {
      return setToast("Please fill all the inputs!", "warning");
    }
    try {
      const res = await dispatch(userSignin(userData));
      if (res.payload === undefined) {
        return setToast("Wrong Credentials! Please check.", "error");
      }
      history.push("/user/dashboard");
    } catch (error) {
      console.log(error);
      dispatch(signout());
    }
  };
  const googleSignIn = async () => {
    try {
      window.location.href = `${API}/login/google/`;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const accessTokenFromRedirect = search.split("?auth_success=")[1];
    (async () => {
      if (
        accessTokenFromRedirect !== undefined &&
        typeof accessTokenFromRedirect === "string"
      ) {
        try {
          setJuneHeader(accessTokenFromRedirect);
          await dispatch(getUserData());
          setToast("Logged In", "success");
          history.push("/user/dashboard");
        } catch (error) {
          console.log(error);
          history.push("/signin");
        }
      }
    })();
  }, [dispatch, history, search, setToast]);

  return (
    <>
      {userStatus === "loading" ? (
        <Loader />
      ) : (
        <div
          className="flex flex-col items-center pt-20 "
          style={{
            background: `url(${gradient}) center center no-repeat`,
            backgroundSize: "cover",
            height: "100vh",
          }}
        >
          <ToastComponent />
          <form
            onSubmit={submitForm}
            className="bg-purple-300 p-8 rounded-lg w-72 xsm:w-96 "
          >
            <h1 className=" text-center font-bold text-4xl mb-5 text-purple-600  ">
              SIGN IN
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
            <p className="text-center font-bold mt-3">
              New here?
              <Link to="/signup" className="text-purple-700  ml-2	">
                Sign Up
              </Link>
            </p>
            <p className="text-center font-bold my-4">OR</p>
            <div className="flex justify-center mt-5">
              <GoogleButton onClick={googleSignIn} />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Signin;
