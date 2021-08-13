import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { JuneAPI } from "../../utils";
import { axiosRequestError } from "../../utils";
import { NotificationStateType } from "./notificationTypes";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => {
    try {
      const response = await JuneAPI.get(`/usernotifications`);
      return response.data;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId: string) => {
    try {
     await JuneAPI.delete(
        `/usernotifications/${notificationId}`
      );
      return notificationId;
    } catch (error) {
      axiosRequestError(error);
    }
  }
);

const initialState: NotificationStateType = {
  notification: [],
  notificationStatus: "idle",
};

export const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationStatus = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notification = action.payload;
        state.notificationStatus = "fetched_notifications";
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.notificationStatus = "failed";
      })
      .addCase(deleteNotification.pending, (state) => {
        state.notificationStatus = "loading";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notificationStatus = "deleted_notifications";
        const updatedNotification = state.notification?.filter(
          (noti) => noti._id !== action.payload
        );
        state.notification = updatedNotification;
      })
      .addCase(deleteNotification.rejected, (state) => {
        state.notificationStatus = "failed";
      });
  },
});

export const selectNotification = (state: RootState) => state.notification;

export default NotificationSlice.reducer;
