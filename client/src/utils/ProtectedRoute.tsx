// ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  // Get the authentication states from Redux
  const { isAuthenticated: isUserAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const { isAuthenticated: isInstructorAuthenticated } = useSelector(
    (state: RootState) => state.instructor
  );

  // Get the current location (so we can redirect to the same place after login)
  const location = useLocation();

  // Check if the user or instructor is authenticated
  const isAuthenticated = isUserAuthenticated || isInstructorAuthenticated;

  // If authenticated, render the component, else redirect to login
  if (isAuthenticated) {
    return element;
  } else {
    return <Navigate to="/user/auth" state={{ from: location }} />;
  }
};

export default ProtectedRoute;
