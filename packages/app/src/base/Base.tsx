import React from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import DesktopNav from "./DesktopNav";
import baseStyles from "./base.module.css"
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
      <div className={`${props.className} pt-1 pb-5`}>{props.children}</div>
    </>
  );
};

export default Base;
