import React from "react";
import CourseCard from "../CourseCard";

interface Course {
  title: string;
  category: string;
  _id: string;
  description: string;
  price: number;
  createdAt:Date;
  enrolledStudents?:string[];
  modules?:string[];
  instructor:string;
}

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
