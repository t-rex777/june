import React, { useState } from "react";

interface ToastStyleProps {
  backgroundColor: string;
  borderTop: string;
}
const useToast = (props: { message: string; type: string }) => {
  let toastStyle: ToastStyleProps;
  switch (props.type) {
    case "success":
      toastStyle = {
        backgroundColor: "#adebad",
        borderTop: "5px solid #2db92d",
      };
      break;
    case "warning":
      toastStyle = {
        backgroundColor: "#fff0b3",
        borderTop: "5px solid #ffcc00",
      };
      break;
    case "info":
      toastStyle = {
        backgroundColor: "#ccf2ff",
        borderTop: "5px solid #33ccff",
      };
      break;
    case "error":
      toastStyle = {
        backgroundColor: "#ffcccc",
        borderTop: "5px solid #ff0000",
      };
      break;
  }

  const [display, setDisplay] = useState<"block" | "none">("none");

  const openToast = () => {
    setDisplay("block");
    setTimeout(() => {
      setDisplay("none");
    }, 3500);
  };
  const ToastComponent = () => (
    <div
      style={{ display, ...toastStyle }}
      className="absolute bottom-5 left-5 px-5 py-3 text-2xl"
    >
      {props.message}
    </div>
  );
  return { openToast, ToastComponent };
};

export default useToast;
