export interface SigninUser {
  username: string;
  password: string;
}

export interface SignupUser {
  name: string;
  email: string;
  username: string;
  password: string;
  bio: string;
}

export interface PostType {
  name: string;
  caption?: string;
  photo?: string;
  likes: any;
  comments: any;
}

export interface UserType extends SignupUser {
  followers: number;
  followings: number;
  posts: PostType[];
}

export interface UserState {
  user: UserType | null;
  status:
    | "idle"
    | "signed out"
    | "signed in"
    | "loading"
    | "success"
    | "failed";
}
