import React, { useState } from "react";

interface ToastStyleProps {
  backgroundColor: string;
  borderTop: string;
}
const useToast = () => {
  const [display, setDisplay] = useState<"block" | "none">("none");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const setToast = (
    toastMessage: string,
    toastType: "success" | "error" | "info" | "warning"
  ) => {
    setMessage(toastMessage);
    setType(toastType);
    setDisplay("block");
    setTimeout(() => {
      setDisplay("none");
    }, 3500);
  };

  let toastStyle: ToastStyleProps;
  const ToastComponent = () => {
    switch (type) {
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
    return (
      <div
        style={{ display, ...toastStyle }}
        className="fixed flex justify-center bottom-16  px-5 py-1 text-xl font-bold z-10 rounded text-center"
      >
        {message}
      </div>
    );
  };
  return { ToastComponent, setToast };
};

export default useToast;
