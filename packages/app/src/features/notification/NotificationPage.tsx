import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import Base from "./../../base/Base";
import { fetchNotifications, selectNotification } from "./notificationSlice";
import { useAppDispatch } from "./../../app/hooks";
import Loader from "./../../base/Loader";
import { NotificationType } from "./notificationTypes";

interface Props {}

const NotificationPage: React.FC<Props> = () => {
  const { notification, notificationStatus } =
    useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (notificationStatus === "idle") {
      setTimeout(() => {
        dispatch(fetchNotifications());
      }, 500);
    }
  }, [dispatch, notificationStatus]);
  console.log(notification);
  return (
    <Base className="flex flex-col justify-center items-center">
      {notificationStatus !== "loading" ? (
        <div>
          <h1 className="text-2xl text-center font-bold">User Notifications</h1>
          <ul>
            {notification &&
              notification.map((item: NotificationType) => (
                <li
                  key={item._id}
                  className="bg-purple-500 text-white px-3 py-2 my-2 rounded"
                >
                  {item.notificationMessage}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <Loader />
      )}
    </Base>
  );
};

export default NotificationPage;
