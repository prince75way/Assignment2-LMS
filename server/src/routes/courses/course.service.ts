import { addCourseToUserProgressService } from '../user/user.service'; 
import Course from './course.schema';
import { CourseDTO } from './course.dto';
import { validateToken } from '../../utils/validate.accesstoken';


/**
 * Creates a new course in the database.
 * @param {CourseDTO} courseData - The new course data
 * @returns {Promise<Course>} - The newly created course
 */
export const createCourseService = async (courseData: CourseDTO) => {

  if (!courseData.accessToken) {
    console.log("accesstokrn hi nhi mil ra");
    return
  }
  const decoded = await validateToken(courseData.accessToken);

  const instructor =decoded.userId


  const newCourse = new Course({
    title:courseData.title,
    description:courseData.description,
    price:courseData.price,
    instructor:instructor,
    image:courseData.image,
    category:courseData.category

  });
  await newCourse.save();
  return newCourse;
};







/**
 * Enroll a user in a course and update both the course and user data.
 * 
 * @param {string} userId - The ID of the student.
 * @param {string} courseId - The ID of the course to enroll in.
 * @returns {Promise<Course>} - The updated course document.
 */
export const enrollInCourseService = async (accessToken: string, courseId: string): Promise<CourseDTO> => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const decoded=await validateToken(accessToken)
  const userId=await decoded.userId;
  if (course.enrolledStudents.includes(userId)) {
    throw new Error('Student is already enrolled in this course');
  }

  // Enroll the student in the course
  const user = await addCourseToUserProgressService(userId, courseId); // Call the service function to update user progress
  
  course.enrolledStudents.push(userId);
  const updatedCourse = await course.save();

  return updatedCourse;
};



// Service to edit a course
/**
 * Updates a course with new data.
 * 
 * @param {string} courseId - The ID of the course to update.
 * @param {Partial<CourseDTO>} updatedData - The data to update the course with.
 * @returns {Promise<Course>} - The updated course document.
 * @throws Error - If the course is not found, or if the update fails.
 */
export const editCourseService = async (courseId: string, updatedData: Partial<CourseDTO>) => {
  try {
    // Find the course by ID and update it
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    return updatedCourse;
  } catch (error:any) {
    throw new Error(error.message || 'Error updating the course');
  }
};

// Service to delete a course
export const deleteCourseService = async (courseId: string) => {
  try {
    // Find the course by ID and delete it
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      throw new Error('Course not found');
    }

    return deletedCourse;
  } catch (error:any) {
    throw new Error(error.message || 'Error deleting the course');
  }
};




/**
 * Fetches a course by its ID and populates the modules.
 * 
 * @param {string} courseId - The ID of the course to fetch.
 * @returns {Promise<Course | null>} - The course document with populated modules or null if not found.
 */
import mongoose from "mongoose";

export const getCourseById = async (courseId: string) => {
  try {

    // console.log("the courseid is: ",courseId)
    const course=await Course.findById(courseId).populate('modules').exec();

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  } catch (error: any) {
    console.error("The error is:", error.message || error);
    throw new Error(error.message || "Error fetching course");
  }
};




/**
 * Adds a module to a course.
 * 
 * @param {string} courseId - The ID of the course to add the module to.
 * @param {string} moduleId - The ID of the module to add to the course.
 * @returns {Promise<Course>} - The updated course with the new module.
 */
export const addModuleToCourseService = async (courseId: string, moduleId: string) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }
  course.modules.push(moduleId);
  await course.save();
  return course;
};
