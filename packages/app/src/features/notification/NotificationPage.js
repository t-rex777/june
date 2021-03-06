import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import Base from "../../base/Base";
import {
  deleteNotification,
  fetchNotifications,
  selectNotification,
} from "./notificationSlice";
import { useAppDispatch } from "../../app/hooks";
import { Image } from "cloudinary-react";
import { selectUser } from "./../userAuth/userSlice";
import { selectPost } from "../post/postSlice";
import useLoader from "../../base/loaders/Loader";
import { source } from "./../../utils";
import moment from "moment";

const NotificationPage = () => {
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const { user } = useAppSelector(selectUser);
  const { notification } = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      setLoaderDisplay("block");
      if (user?._id) {
        try {
          const res = await dispatch(fetchNotifications());
          res.payload && setLoaderDisplay("none");
        } catch (error) {
          console.log(error);
          setLoaderDisplay("none");
        }
      }
    })();
    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Base className="flex flex-col justify-center items-center">
      <div>
        <LoaderComponent />
        <h1 className="text-2xl text-center font-bold">User Notifications</h1>
        <ul>
          {notification &&
            notification.map((item) => (
              <li
                key={item._id}
                className="border-2 border-gray-400 px-3 py-2 my-2 rounded max-w-5xl"
              >
                <span className="flex">
                  <span className="self-start  min-w-max">
                    {item.actionBy && (
                      <Image
                        cloudName="june-social"
                        publicId={item.actionBy.profile_photo}
                        width="30"
                        height="30"
                        responsiveUseBreakpoints="true"
                        crop="fill"
                        radius="max"
                      />
                    )}
                  </span>
                  <span className="flex flex-col flex-grow">
                    <p className=" ml-2">{item.notificationMessage}</p>
                    <p className="text-gray-400 ml-2 text-xs font-bold">
                      {moment(new Date(item.createdAt), "YYYYMMDD").fromNow()}
                    </p>
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={async () => {
                      try {
                        console.log("deleting...");
                        await dispatch(deleteNotification(item._id));
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    &#10060;
                  </span>
                </span>
              </li>
            ))}
          {notification.length === 0 && (
            <li className="border-2 text-center border-gray-400 px-3 py-2 my-2 rounded max-w-5xl">
              No notifications found!
            </li>
          )}
        </ul>
      </div>
    </Base>
  );
};

export default NotificationPage;
