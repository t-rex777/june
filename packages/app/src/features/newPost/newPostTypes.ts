import { PostType } from "../userAuth/userTypes";

export interface newPostState {
  posts: PostType | null;
  postStatus: "idle" | "loading" | "uploaded" | "posts_loading" | "posts_fetched";
}

export interface newPostInput {
  caption: string | number | readonly string[] | undefined;
  photo: string | number | readonly string[] | undefined;
}

