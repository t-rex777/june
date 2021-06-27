import { UserType } from "./../userAuth/userTypes";

export const isFollowing = (user: UserType, person: UserType) =>
  user.followings.includes(person._id);
