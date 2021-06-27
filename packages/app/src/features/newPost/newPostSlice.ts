import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { JuneAPI } from "../../utils";
import { axiosRequestError } from "../../utils";
import { newPostState } from "./newPostTypes";

const initialState: newPostState = {
  posts: null,
  postStatus: "idle",
};

export const fetchPosts = createAsyncThunk("newPost/fetch", async () => {
  try {
    const response = await JuneAPI.get("/user/posts");
    return response.data;
  } catch (error) {
    axiosRequestError(error);
  }
});


export const uploadPost = createAsyncThunk(
  "newPost/upload",
  async (postfile : any) => {
    // console.log("postfile")
    try {
      const response = await JuneAPI.post("/post/upload", {
        ...postfile,
      });
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const userSlice = createSlice({
  name: "newPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadPost.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(uploadPost.fulfilled, (state) => {
        state.postStatus = "uploaded";
      })
      .addCase(fetchPosts.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.postStatus = "posts_fetched";
      });
  },
});


export const selectPost = (state: RootState) => state.newPost;

export default userSlice.reducer;
