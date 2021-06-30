export interface NotiUserType {
  _id: string;
  username: string;
  profile_photo: string;
}

export interface NotificationType {
  _id: string;
  notificationMessage: string;
  user: NotiUserType;
  post?: string;
  actionBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationStateType {
  notification: NotificationType[] | null;
  notificationStatus: "idle" | "loading" | "fetched_notifications" | "failed";
}
