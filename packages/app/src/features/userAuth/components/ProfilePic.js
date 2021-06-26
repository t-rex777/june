import React from "react";
import { Image } from "cloudinary-react";

function ProfilePic({ user_profile_pic }) {
  return (
    <Image
      cloudName="june-social"
      publicId={user_profile_pic}
      width="250"
      height="250"
      responsiveUseBreakpoints="true"
      crop="fill"
      radius="max"
    />
  );
}

export default ProfilePic;
