import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import Base from "../../base/Base";
import { fetchNotifications, selectNotification } from "./notificationSlice";
import { useAppDispatch } from "../../app/hooks";
import { Image } from "cloudinary-react";
import { selectUser } from "./../userAuth/userSlice";
import { selectPost } from "../post/postSlice";
import useLoader from "./../../base/Loader";

const NotificationPage = () => {
  const { LoaderComponent, setLoaderDisplay } = useLoader();
  const { user, userStatus } = useAppSelector(selectUser);
  const { postStatus } = useAppSelector(selectPost);
  const { notification, notificationStatus } =
    useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (
      userStatus === "signed_in" ||
      userStatus === "fetched_userdata" ||
      userStatus === "fetched_juneposts" ||
      userStatus === "fetched_allusers" ||
      postStatus === "post_uploaded" ||
      postStatus === "post_caption_edited"
    )
      dispatch(fetchNotifications());
  }, [dispatch, postStatus, userStatus]);
  return (
    <Base className="flex flex-col justify-center items-center">
      {notificationStatus === "loading" && !user
        ? setLoaderDisplay("block")
        : setLoaderDisplay("none")}
      <div>
        <LoaderComponent />
        <h1 className="text-2xl text-center font-bold">User Notifications</h1>
        <ul>
          {notification &&
            notification.map((item) => (
              <li
                key={item._id}
                className="border-2 border-gray-400 px-3 py-2 my-2 rounded"
              >
                <span className="flex">
                  <span>
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

                  <p className="mt-1 ml-2">{item.notificationMessage}</p>
                </span>
              </li>
            ))}
        </ul>
      </div>
    </Base>
  );
};

export default NotificationPage;
