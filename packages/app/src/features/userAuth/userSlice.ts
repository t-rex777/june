import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { JuneAPI, setJuneHeader } from "../../utils";
import { SigninUser, UpdateUserType, UserState } from "./userTypes";
import { axiosRequestError } from "../../utils";

const initialState: UserState = {
  user: null,
  posts: null,
  status: "idle",
};

export const userSignin = createAsyncThunk(
  "user/signin",
  async (userData: SigninUser) => {
    try {
      const response = await JuneAPI.post(`/signin`, {
        ...userData,
      });
      const { userDetails, accessToken, refreshToken } = response.data;
      localStorage.setItem("__rtoken", refreshToken);
      setJuneHeader(accessToken);
      return userDetails;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const userSignup = createAsyncThunk(
  "user/signup",
  async (userData: SigninUser) => {
    try {
      const response = await JuneAPI.post(`/signup`, {
        ...userData,
      });
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const getUserData = createAsyncThunk("user/data", async () => {
  try {
    const response = await JuneAPI.get("/user");
    return response.data;
  } catch (error) {
    axiosRequestError(error);
  }
});

export const updateUser = createAsyncThunk(
  "user/update",
  async (userData: UpdateUserType) => {
    try {
      const response = await JuneAPI.post("/user/update", {
        ...userData,
      });
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signout: (state) => {
      state.user = null;
      state.status = "signed out";
      localStorage.removeItem("__rtoken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userSignin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "signed in";
      })
      .addCase(userSignup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userSignup.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(getUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "signed in";
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "success";
      })
  },
});
export const { signout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
