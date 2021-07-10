import { PostType } from "../userAuth/userTypes";

export interface postState {
  posts: PostType[] | null;
  postStatus:
    | "idle"
    | "loading"
    | "junePosts_loading"
    | "post_uploaded"
    | "posts_loading"
    | "junePosts_fetched"
    | "post_liked"
    | "post_unliked"
    | "post_commented"
    | "post_uncommented"
    | "post_caption_edited";
}

export interface PostInput {
  caption: string | number | readonly string[] | undefined;
}

export interface CommentType {
  postId : String;
  comment: String;
}

export interface EditCaptionType {
  postId : string;
  caption : string;
}