import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { JuneAPI } from "../../utils";
import { axiosRequestError } from "../../utils";
import { CommentType, postState } from "./postTypes";

const initialState: postState = {
  posts: null,
  postStatus: "idle",
};

export const fetchPosts = createAsyncThunk("post/fetch", async () => {
  try {
    const response = await JuneAPI.get("/user/posts");
    return response.data;
  } catch (error) {
    axiosRequestError(error);
  }
});

export const uploadPost = createAsyncThunk(
  "post/upload",
  async (postfile: any) => {
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

export const likePost = createAsyncThunk(
  "post/like",
  async (postId: string) => {
    try {
      const response = await JuneAPI.patch(`/post/like/${postId}`);
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const unlikePost = createAsyncThunk(
  "post/unlike",
  async (postId: string) => {
    try {
      const response = await JuneAPI.patch(`/post/unlike/${postId}`);
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const commentPost = createAsyncThunk(
  "post/comment",
  async (userComment: CommentType) => {
    try {
      const response = await JuneAPI.post(
        `/post/comment/${userComment.postId}`,
        {
          ...userComment,
        }
      );
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const uncommentPost = createAsyncThunk(
  "post/uncomment",
  async (postId, commentId) => {
    try {
      const response = await JuneAPI.post(
        `/post/uncomment/${postId}/${commentId}`
      );
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
        state.postStatus = "posts_loading";
      })
      .addCase(uploadPost.fulfilled, (state) => {
        state.postStatus = "post_uploaded";
      })
      .addCase(fetchPosts.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.postStatus = "posts_fetched";
      })
      .addCase(likePost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(likePost.fulfilled, (state) => {
        state.postStatus = "post_liked";
      })
      .addCase(unlikePost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(unlikePost.fulfilled, (state) => {
        state.postStatus = "post_unliked";
      })
      .addCase(commentPost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(commentPost.fulfilled, (state) => {
        state.postStatus = "post_commented";
      })
      .addCase(uncommentPost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(uncommentPost.fulfilled, (state) => {
        state.postStatus = "post_uncommented";
      });
  },
});

export const selectPost = (state: RootState) => state.post;

export default userSlice.reducer;
