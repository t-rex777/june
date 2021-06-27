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
  public_id?: string;
  caption?: string;
  photo?: string;
  likes: any;
  comments: any;
}

export interface UpdateUserType {
  profile_photo?: string;
  username?: string;
  email?: string;
  name?: string;
  bio?: string;
}

export interface UserType extends SignupUser {
  profile_photo?: string;
  followers: string[];
  followings: string[];
  posts: PostType[];
  _id: string;
}

export interface UserState {
  user: UserType | null;
  posts: PostType | null;
  status:
    | "idle"
    | "signed out"
    | "signed in"
    | "loading"
    | "success"
    | "failed";
}
