import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { JuneAPI } from "../../utils";
import { axiosRequestError } from "../../utils";
import { CommentType, EditCaptionType, postState } from "./postTypes";

const initialState: postState = {
  posts: null,
  post: null,
  postStatus: "idle",
};


export const fetchPostById = createAsyncThunk(
  "post/fetchPostById",
  async (postId: string) => {
    try {
      const response = await JuneAPI.get(`/post/${postId}`);
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const fetchJunePosts = createAsyncThunk(
  "post/fetchJunePosts",
  async () => {
    try {
      const response = await JuneAPI.get("/juneposts");
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const uploadPost = createAsyncThunk(
  "post/upload",
  async (postfile: any) => {
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

export interface UncommentPropType {
  postId: string;
  commentId: string;
}

export const uncommentPost = createAsyncThunk(
  "post/uncomment",
  async (reqIds: UncommentPropType) => {
    try {
      console.log(reqIds);
      const { postId, commentId } = reqIds;
      const response = await JuneAPI.post(
        `/post/uncomment/${postId}/${commentId}`
      );
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const editCaption = createAsyncThunk(
  "post/editcaption",
  async (editedCaption: EditCaptionType) => {
    try {
      const response = await JuneAPI.patch(
        `/post/update/caption/${editedCaption.postId}`,
        {
          editedCaption,
        }
      );
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const postSlice = createSlice({
  name: "newPost",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(uploadPost.fulfilled, (state) => {
        state.postStatus = "post_uploaded";
      })

      .addCase(fetchPostById.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postStatus = "post_fetched";
      })
      .addCase(fetchJunePosts.pending, (state) => {
        state.postStatus = "junePosts_loading";
      })
      .addCase(fetchJunePosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.postStatus = "junePosts_fetched";
      })
      .addCase(likePost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postStatus = "post_liked";
      })
      .addCase(unlikePost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postStatus = "post_unliked";
      })
      .addCase(commentPost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postStatus = "post_commented";
      })
      .addCase(uncommentPost.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(uncommentPost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postStatus = "post_uncommented";
      })
      .addCase(editCaption.pending, (state) => {
        state.postStatus = "posts_loading";
      })
      .addCase(editCaption.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postStatus = "post_caption_edited";
      });
  },
});

export const { setPost } = postSlice.actions;

export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
