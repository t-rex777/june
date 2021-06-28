import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/userAuth/userSlice";
import personReducer from "../features/person/personSlice";
import postReducer from "../features/post/postSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    person : personReducer,
    post: postReducer,
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
