import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCoursesQuery } from "../services/courseServices";
import { RootState, AppDispatch } from "../redux/store";
import { setFilterCategory } from "../redux/slices/courseSlice";
import CourseList from "../components/CouseLIst";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {

  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
    handleFilterChange(event.target.value)
  };

  const dispatch = useDispatch<AppDispatch>();
  const { data: courses, isLoading, error } = useGetCoursesQuery({});
  const filterCategory = useSelector((state: RootState) => state.course.filterCategory);

  const navigate = useNavigate(); // Using useNavigate from react-router-dom v6

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
    <>
      {/* Welcome Section */}
      <Box sx={{ py: 8, backgroundColor: '#f4f6f8' }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom align="center" color="primary">
            Welcome to Our Learning Platform
          </Typography>
          <Typography variant="h6" paragraph align="center" color="textSecondary">
            Discover a wide range of courses designed to help you master new skills and advance your career. Start exploring today!
          </Typography>
          {/* Navigate to Courses */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={() => navigate('#courses')} // Use navigate() for routing
            >
              Browse Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Course Filter Section */}
      <Box sx={{ minWidth: 120, py: 4 }} id="courses">
        <Container maxWidth="sm">
          <FormControl sx={{ minWidth: 160, marginBottom: 6 }} fullWidth>
            <InputLabel id="course-select-label">Filter Courses</InputLabel>
            <Select
              labelId="course-select-label"
              id="course-select"
              value={age}
              onChange={handleChange}
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"Programming"}>Programming</MenuItem>
              <MenuItem value={"Development"}>Development</MenuItem>
            </Select>
          </FormControl>
        </Container>
      </Box>

      {/* Display Courses */}
      <Container maxWidth="lg">
        {filteredCourses && (
          <CourseList courses={filteredCourses} />
        )}
      </Container>
    </>
  );
};

export default Home;
