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
  _id: string;
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
  allUsers: UserType[] | null;
  junePosts: PostType[] | null;
  userStatus:
    | "idle"
    | "signed_out"
    | "signed_up"
    | "signed_in"
    | "loading"
    | "success"
    | "fetched_userdata"
    | "updated_user"
    | "fetched_juneposts"
    | "fetched_allusers"
    | "updated_user_profilephoto"
    | "failed";
}
