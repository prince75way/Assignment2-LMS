import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Basic from './layout/Basic';
import Home from './pages/homepage';
import UserAuth from './pages/userauth';
import InstructorLoginPage from './pages/instructorloginpage';
import ManageCourses from './pages/managecourse';
import AddCourse from './pages/addcoursepage';

// Lazy load the CourseModulesPage
const CourseModulesPage = React.lazy(() => import('./pages/coursemodulepage'));

const App: React.FC = () => {
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

<Route element={<ManageCourses/>} path='/instructor/manage/courses'/>

<Route element={<AddCourse/>} path="/instructor/add/course"/>
          </Route>



      </Routes>
    </>
  );
};

export default App;
