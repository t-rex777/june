import React from "react";
import styles from "./base.module.css";

const Loader: React.FC = () => {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loader}></div>
      <p className="mt-6">Loading... please wait</p>
    </div>
  );
};

export default Loader;
