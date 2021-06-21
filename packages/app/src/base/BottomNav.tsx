import React from "react";

interface Props {}

const BottomNav: React.FC<Props> = () => {
  return (
    <nav>
      <ul>
        <li>{/* Home */}</li>
        <li>{/*New post*/}</li>
        <li>{/* Notification */}</li>
        <li>{/* User */}</li>
      </ul>
    </nav>
  );
};

export default BottomNav;
