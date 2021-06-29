import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { JuneAPI } from "../../utils";
import { axiosRequestError } from "../../utils";
import { PersonStateType } from "./personTypes";

export const getPerson = createAsyncThunk(
  "person/fetch",
  async (personUserName: string) => {
    const accessToken = JuneAPI.defaults.headers.common["authorization"];
    if (accessToken) {
      try {
        const response = await JuneAPI.get(`/person/${personUserName}`);
        return response.data;
      } catch (error) {
        axiosRequestError(error);
      }
    }
  }
);

export const followPerson = createAsyncThunk(
  "person/follow",
  async (personUsername: string) => {
    try {
      const response = await JuneAPI.patch(
        `person/${personUsername}/updateFollowers`
      );
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const unfollowPerson = createAsyncThunk(
  "person/unfollow",
  async (personUsername: string) => {
    try {
      const response = await JuneAPI.patch(`person/${personUsername}/unfollow`);
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

const initialState: PersonStateType = {
  person: null,
  personStatus: "idle",
};

export const PersonSlice = createSlice({
  name: "person",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPerson.pending, (state) => {
        state.personStatus = "loading";
      })
      .addCase(getPerson.fulfilled, (state, action) => {
        state.person = action.payload;
        state.personStatus = "fetched_persondata";
      })
      .addCase(followPerson.pending, (state) => {
        state.personStatus = "loading";
      })
      .addCase(followPerson.fulfilled, (state, action) => {
        state.person = action.payload;
        state.personStatus = "followed_person";
      })
      .addCase(unfollowPerson.pending, (state) => {
        state.personStatus = "loading";
      })
      .addCase(unfollowPerson.fulfilled, (state, action) => {
        state.person = action.payload;
        state.personStatus = "unfollowed_person";
      });
  },
});

export const selectPerson = (state: RootState) => state.person;

export default PersonSlice.reducer;
