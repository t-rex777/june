import React from "react";
import TopNav from "./MobileTopNav";
import BottomNav from "./MobileBottomNav";
import DesktopNav from "./DesktopNav";
import baseStyles from "./base.module.css";
import Loader from "./Loader";
interface Props {
  className?: string;
  children: React.ReactNode;
}

const Base: React.FC<Props> = (props) => {
  return (
    <>
      <div className={baseStyles.mobileNav}>
        <TopNav />
        <BottomNav />
      </div>
      <div className={baseStyles.desktopNav}>
        <DesktopNav />
      </div>
      <div className={`${props.className} py-16 px-5 `}>
        {props.children}
      </div>
    </>
  );
};

export default Base;
