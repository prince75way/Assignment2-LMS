import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <p>&copy; 2025 Your LMS Name. All rights reserved.</p>
    </div>
  );
};

export default Footer;
