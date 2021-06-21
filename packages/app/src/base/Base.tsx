import React from "react";
import BottomNav from "./BottomNav";
import TopNav from "./TopNav";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Base: React.FC<Props> = (props) => {
  return (
    <div className={props.className}>
      <TopNav />
      {props.children}
      <BottomNav />
    </div>
  );
};

export default Base;
