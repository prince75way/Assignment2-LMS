import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCoursesQuery } from "../services/courseServices";
import { RootState, AppDispatch } from "../redux/store";
import { setFilterCategory } from "../redux/slices/courseSlice";
import CourseList from "../components/CouseLIst";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: courses, isLoading, error } = useGetCoursesQuery({});
  const filterCategory = useSelector((state: RootState) => state.course.filterCategory);

  interface Course {
    title: string;
    category: string;
    _id: string;
    description: string;
    price: number;
    createdAt: Date;
    enrolledStudents?: string[];
    modules?: string[];
    instructor: string;
  }

  const filteredCourses: Course[] | undefined =
    filterCategory === "all"
      ? courses
      : courses?.filter((course: Course) => course.category === filterCategory);

  const handleFilterChange = (category: string) => {
    dispatch(setFilterCategory(category));
  };

  if (isLoading) return <p>Loading courses...</p>;
  if (error) {
    console.log(error);
    return <p>Error loading courses. Please try again later.</p>;
  }

  return (
    <div>
      <h1>Available Courses</h1>

      {/* Filter Dropdown */}
      <select
        value={filterCategory}
        onChange={(e) => handleFilterChange(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom:"25px"
        }}
      >
        <option value="all">All</option>
        <option value="programming">Programming</option>
        <option value="design">Design</option>
        <option value="marketing">Marketing</option>
      </select>

      {/* Course List */}
      {filteredCourses && <CourseList courses={filteredCourses} />}
    </div>
  );
};

export default Home;