import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import Base from "../../base/Base";
import { fetchNotifications, selectNotification } from "./notificationSlice";
import { useAppDispatch } from "../../app/hooks";
import Loader from "../../base/Loader";
import { selectUser } from "../userAuth/userSlice";
import { Image } from "cloudinary-react";

const NotificationPage = () => {
  const { userStatus } = useAppSelector(selectUser);
  const { notification, notificationStatus } =
    useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (notificationStatus === "idle" || userStatus === "fetched_userdata") {
      dispatch(fetchNotifications());
    }
  }, [dispatch, notificationStatus, userStatus]);
  return (
    <Base className="flex flex-col justify-center items-center">
      {notificationStatus !== "loading" ? (
        <div>
          <h1 className="text-2xl text-center font-bold">User Notifications</h1>
          <ul>
            {notification &&
              notification.map((item) => (
                <li
                  key={item._id}
                  className="border-2 border-gray-400 px-3 py-2 my-2 rounded"
                >
                  <span className="flex">
                    <Image
                      cloudName="june-social"
                      publicId={item.user.profile_photo}
                      width="30"
                      height="30"
                      responsiveUseBreakpoints="true"
                      crop="fill"
                      radius="max"
                    />
                    <p className="mt-1 ml-2">{item.notificationMessage}</p>
                  </span>
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
