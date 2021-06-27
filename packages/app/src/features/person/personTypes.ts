import { UserType } from "./../userAuth/userTypes";

export interface PersonStateType {
  person: UserType | null;
  personStatus: "idle" | "loading" | "success" | "failed";
}
export interface paramsType {
  personUsername : string
}