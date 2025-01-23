import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate=useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Collapsed Sidebar Trigger */}
      {!isOpen && (
        <div className={styles.collapsed} onClick={toggleSidebar}>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </div>
      )}

      {/* Expanded Sidebar */}
      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        onMouseLeave={() => setIsOpen(false)} // Close sidebar when mouse leaves
      >
        <ul>
          <li className={styles.item} onClick={()=>{navigate('/')}}>Home</li>
          <li className={styles.item} onClick={()=>{navigate('/')}}>Courses</li>
          <li className={styles.item}>Modules</li>
          <li className={styles.item} onClick={()=>{navigate('/user/auth')}}>User Login/Signup</li>
          <li className={styles.item} onClick={()=>{navigate('/instructor/login')}}>Instructor Login</li>
        { localStorage.getItem('role') && <li className={styles.item} onClick={()=>{navigate('/instructor/manage/courses')}}>Manage Courses</li>}
        { localStorage.getItem('role') && <li className={styles.item} onClick={()=>{navigate('/instructor/add/course')}}>Add Course</li>}
       
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
