import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/userAuth/userSlice";
import personReducer from "../features/person/personSlice";
import newPostReducer from "../features/post/postSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    person : personReducer,
    newPost: newPostReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
