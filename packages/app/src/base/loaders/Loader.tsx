import React, { useState } from "react";
import smallSvg from "../../images/rolling.svg";
const useLoader = () => {
  const [loaderDisplay, setLoaderDisplay] = useState<"none" | "block">("none");
  const [smallLoaderDisplay, setSmallLoaderDisplay] = useState<
    "none" | "block"
  >("none");
  const SmallLoader = () => (
    <p style={{ display: smallLoaderDisplay }}>
      <img src={smallSvg} alt="loader" />
    </p>
  );
  const LoaderComponent = () => {
    return (
      <div style={{ display: loaderDisplay }}>
        <div className="fixed top-0 left-0 z-30 w-full h-full bg-white"></div>
        <div className="fixed top-1/2 z-40  left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center text-white text-3xl lg:text-6xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              className="block bg-transparent m-auto"
              width="100px"
              height="100px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <circle
                cx="50"
                cy="50"
                fill="none"
                stroke="#6366F1"
                strokeWidth="9"
                r="40"
                strokeDasharray="188.49555921538757 64.83185307179586"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  repeatCount="indefinite"
                  dur="1s"
                  values="0 50 50;360 50 50"
                  keyTimes="0;1"
                ></animateTransform>
              </circle>
            </svg>
          </div>
        </div>
      </div>
    );
  };
  return {
    LoaderComponent,
    setLoaderDisplay,
    SmallLoader,
    setSmallLoaderDisplay,
  };
};

export default useLoader;
