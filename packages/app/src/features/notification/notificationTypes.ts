export interface NotificationType {
  _id: string;
  notificationMessage: string;
  user: string;
  post?: string;
  actionBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationStateType {
  notification: NotificationType[] | null;
  notificationStatus: "idle" | "loading" | "fetched_notifications" | "failed";
}
