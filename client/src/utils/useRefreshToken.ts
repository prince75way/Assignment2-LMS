// import { useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// // Function to decode JWT and get the expiration time using jwt-decode
// const decodeToken = (token: string) => {
//   const decoded = jwtDecode(token) as { exp: number }; // Decode JWT and cast the type
//   return decoded.exp * 1000; // Convert from seconds to milliseconds
// };

// const useTokenRefresh = () => {
//   useEffect(() => {
//     // Function to check if the token is about to expire
//     const checkTokenExpiry = () => {
//       const accessToken = localStorage.getItem("accessToken");

//       if (!accessToken) {
//         console.log("No access token found.");
//         return;
//       }

//       const expiryTime = decodeToken(accessToken); // Get expiry from the access token
//       const timeLeft = expiryTime - Date.now();

//       console.log(`Time left before expiry: ${timeLeft / 1000} seconds`);

//       const refreshTime = 54 * 60 * 1000; // 54 minutes in milliseconds

//       if (timeLeft <= 0) {
//         // Token is already expired, attempt to refresh immediately
//         console.log("Token already expired, attempting refresh...");
//         refreshAccessToken();
//       } else if (timeLeft <= refreshTime) {
//         // Token will expire within 54 minutes, refresh immediately
//         console.log("Token is close to expiry (within 54 minutes), attempting immediate refresh...");
//         refreshAccessToken();
//       } else {
//         // Token is still valid, schedule refresh 6 minutes before expiry
//         const timeUntilRefresh = timeLeft - refreshTime;
//         console.log(`Token is valid. Scheduling refresh in ${timeUntilRefresh / 1000} seconds...`);

//         setTimeout(() => {
//           refreshAccessToken();
//         }, timeUntilRefresh);
//       }
//     };

//     // Function to call the backend API to refresh the access token
//     const refreshAccessToken = async () => {
//       console.log("Attempting to refresh access token...");
//       try {
//         // Call your backend to get a new access token using the refresh token
//         const response = await axios.post("http://localhost:8000/api/user/refresh-token", { 
//           accessToken: localStorage.getItem('accessToken') 
//         });

//         const newAccessToken = response.data.data.accessToken;
//         console.log("Received new access token:", newAccessToken);

//         // Update the localStorage with the new accessToken
//         localStorage.setItem("accessToken", newAccessToken);
//         console.log("Access token successfully refreshed.");
//       } catch (error) {
//         console.error("Error refreshing access token:", error);
//         // Handle error (e.g., log out user or redirect to login page)
//       }
//     };

//     // Check token expiry when the component mounts
//     checkTokenExpiry();

//     // Set an interval to check token expiry every minute
//     const interval = setInterval(checkTokenExpiry, 54*60 * 1000);

//     // Cleanup the interval when the component unmounts
//     return () => clearInterval(interval);
//   }, []);
// };

// export default useTokenRefresh;
