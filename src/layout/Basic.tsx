import React from "react";
import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import styles from "./Basic.module.css";

const Basic: React.FC = () => {
  return (
    <Box className={styles.root}>
      <Typography variant="h5" className={styles.header}>
        LEARNING MANAGEMENT SYSTEM
      </Typography>
      <Box className={styles.contentWrapper}>
        <Box className={styles.content}>
          <Outlet />
        </Box>
        <Box className={styles.sidebar}>
          <Sidebar />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Basic;
