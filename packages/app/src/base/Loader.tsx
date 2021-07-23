import React, { useState } from "react";
import styles from "./base.module.css";

const useLoader = () => {
  const [loaderDisplay, setLoaderDisplay] = useState<"none" | "block">("none");

  const LoaderComponent = () => {
    return (
      <div className={styles.loadingPage} style={{ display: loaderDisplay }}>
        <div className={styles.loader}></div>
        <p className="mt-6">Loading... please wait</p>
      </div>
    );
  };
  return { LoaderComponent, setLoaderDisplay };
};

export default useLoader;
