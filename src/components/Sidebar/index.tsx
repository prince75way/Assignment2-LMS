import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { logout as userLogout } from "../../redux/slices/userSlice"; // Import user logout action
import { Drawer, List, ListItem, ListItemText, IconButton, Divider, ListItemIcon, Box } from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon, Home as HomeIcon, LibraryBooks as LibraryBooksIcon, Close as CloseIcon } from "@mui/icons-material";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access Redux state for user and instructor authentication
  const { isAuthenticated: isInstructorAuthenticated } = useSelector(
    (state: RootState) => state.instructor
  );
  const { isAuthenticated: isUserAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  // Check if any user is logged in
  const isAuthenticated = isInstructorAuthenticated || isUserAuthenticated;

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Logout handler
  const handleLogout = () => {
    if (isInstructorAuthenticated) {
      dispatch(instructorLogout());
    } else if (isUserAuthenticated) {
      dispatch(userLogout());
    }
    localStorage.removeItem("accessToken");
    navigate("/"); // Navigate to home after logout
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <IconButton
        color="primary"
        onClick={toggleSidebar}
        sx={{
          display: "inline-flex",
          height: 20,
          marginTop: 1,
          fontSize: "2rem", // Adjust size for MenuIcon
        }}
      >
        <MenuIcon sx={{ fontSize: "inherit" }} /> {/* Inherit font size */}
      </IconButton>

      {/* Sidebar */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleSidebar}
        variant="temporary" // Temporary for mobile
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            backgroundColor: "#1466d8", // Elegant dark background
            color: "white", // White text for better readability
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}>
          {/* Close Button */}
          <IconButton onClick={toggleSidebar} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ padding: 0 }}>
          {/* Home Link */}
          <ListItem
            component="button"
            onClick={() => navigate("/")}
            sx={{
              "&:hover": {
                backgroundColor: "#0f86e0", // Slightly lighter hover effect
              },
              color: "white",
              backgroundColor: "#3182c1",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <HomeIcon sx={{ fontSize: 24 }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {/* Courses Link */}
          <ListItem
            component="button"
            onClick={() => navigate("/")}
            sx={{
              "&:hover": {
                backgroundColor: "#0f86e0",
              },
              color: "white",
              backgroundColor: "#3182c1",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <LibraryBooksIcon sx={{ fontSize: 24 }} />
            </ListItemIcon>
            <ListItemText primary="Courses" />
          </ListItem>

          {/* Modules Link */}
          <ListItem
            component="button"
            sx={{
              "&:hover": {
                backgroundColor: "#0f86e0",
              },
              color: "white",
              backgroundColor: "#3182c1",
            }}
          >
            <ListItemText primary="Modules" />
          </ListItem>

          {!isAuthenticated && (
            <>
              {/* User Login/Signup Link */}
              <ListItem
                component="button"
                onClick={() => navigate("/user/auth")}
                sx={{
                  "&:hover": {
                    backgroundColor: "#0f86e0",
                  },
                  color: "white",
                  backgroundColor: "#3182c1",
                }}
              >
                <ListItemText primary="User Login/Signup" />
              </ListItem>

              {/* Instructor Login Link */}
              <ListItem
                component="button"
                onClick={() => navigate("/instructor/login")}
                sx={{
                  "&:hover": {
                    backgroundColor: "#0f86e0",
                  },
                  color: "white",
                  backgroundColor: "#3182c1",
                }}
              >
                <ListItemText primary="Instructor Login" />
              </ListItem>
            </>
          )}

          {/* Show Logout if Authenticated */}
          {isAuthenticated && (
            <ListItem
              component="button"
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "#0f86e0",
                },
                color: "white",
                backgroundColor: "#3182c1",
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          )}

          {/* Instructor-specific Links */}
          {isInstructorAuthenticated && (
            <>
              <Divider sx={{ backgroundColor: "white" }} />
              <ListItem
                component="button"
                onClick={() => navigate("/instructor/manage/courses")}
                sx={{
                  "&:hover": {
                    backgroundColor: "#2C3E50",
                  },
                  color: "white",
                  backgroundColor: "#3182c1",
                }}
              >
                <ListItemText primary="Manage Courses" />
              </ListItem>
              <ListItem
                component="button"
                onClick={() => navigate("/instructor/add/course")}
                sx={{
                  "&:hover": {
                    backgroundColor: "#0f86e0",
                  },
                  color: "white",
                  backgroundColor: "#3182c1",
                }}
              >
                <ListItemText primary="Add Course" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
import { logout as instructorLogout } from "../../redux/slices/instructorSlice"; // Import instructor logout action

