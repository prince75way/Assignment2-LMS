import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Adjust the path to your store definition
import { Card, CardContent, Typography, Box, Alert } from "@mui/material";

const Dashboard: React.FC = () => {
  // Access auth state from Redux
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  // If the user is not authenticated, display an error or redirect
  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Alert severity="error" sx={{ width: 400, textAlign: "center",color:"black" }}>
          You are not logged in. Please log in to view your dashboard.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        sx={{
          width: 400,
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            User Dashboard
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ marginBottom: 1, color: "text.secondary" }}
          >
            <strong>Name:</strong> {user.name}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ color: "text.secondary" }}
          >
            <strong>Email:</strong> {user.email}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
