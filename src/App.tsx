import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Basic from './layout/Basic';
import Home from './pages/homepage';
import UserAuth from './pages/userauth';
import InstructorLoginPage from './pages/instructorloginpage';
import ManageCourses from './pages/managecourse';
import AddCourse from './pages/addcoursepage';
import { useDispatch, useSelector } from 'react-redux';
import useInactivity from './hooks/userInactivity';
import { logout as userLogout } from './redux/slices/userSlice';
import { logout as instructorLogout } from './redux/slices/instructorSlice';
import { RootState } from './redux/store'; // Import your RootState type


// Lazy load the CourseModulesPage
const CourseModulesPage = React.lazy(() => import('./pages/coursemodulepage'));

const App: React.FC = () => {
  const dispatch = useDispatch();
  // useTokenRefresh();

  // Access authentication states
  const { isAuthenticated: isUserAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const { isAuthenticated: isInstructorAuthenticated } = useSelector(
    (state: RootState) => state.instructor
  );

  // Use the inactivity hook
  useInactivity(30 * 60 * 1000, () => {
    if (isUserAuthenticated) {
      dispatch(userLogout()); // Log out the user
      alert('User session expired due to inactivity.');
    } else if (isInstructorAuthenticated) {
      dispatch(instructorLogout()); // Log out the instructor
      alert('Instructor session expired due to inactivity.');
    }
  });

  return (
    <>
      <Routes>
        <Route element={<Basic />}>
          <Route element={<Home />} path="/" />
          <Route element={<UserAuth />} path="/user/auth" />
          {/* Lazy loaded modules route */}
          <Route
            path="/courses/:courseName"
            element={
              <Suspense fallback={<p>Loading Modules Page...</p>}>
                <CourseModulesPage />
              </Suspense>
            }
          />
          <Route element={<InstructorLoginPage />} path="/instructor/login" />
          <Route element={<ManageCourses />} path="/instructor/manage/courses" />
          <Route element={<AddCourse />} path="/instructor/add/course" />
        </Route>
      </Routes>
    </>
  );
};

export default App;
