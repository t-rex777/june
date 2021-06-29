import { UserType } from "./../userAuth/userTypes";

export interface PersonStateType {
  person: UserType | null;
  personStatus:
    | "idle"
    | "loading"
    | "success"
    | "failed"
    | "fetched_persondata"
    | "followed_person"
    | "unfollowed_person";
}
export interface paramsType {
  personUsername: string;
}
