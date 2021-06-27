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

const initialState: PersonStateType = {
  person: null,
  status: "idle",
};

export const PersonSlice = createSlice({
  name: "person",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPerson.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPerson.fulfilled, (state, action) => {
        state.person = action.payload;
        state.status = "success";
      })
      .addCase(followPerson.pending, (state) => {
        state.status = "loading";
      })
      .addCase(followPerson.fulfilled, (state, action) => {
        state.person = action.payload;
        state.status = "success";
      })
  },
});

export const selectPerson = (state: RootState) => state.person;

export default PersonSlice.reducer;
