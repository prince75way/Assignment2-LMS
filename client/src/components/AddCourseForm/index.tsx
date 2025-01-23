import React, { useState } from 'react';
import { useAddCourseMutation } from '../../services/courseServices'; // Import the hook
import styles from './AddCourseForm.module.css'; // Import CSS Modules
import { toast } from 'react-toastify';

const AddCourseForm = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [addCourse, { isLoading}] = useAddCourseMutation();

interface CourseData {
    title: string;
    description: string;
    instructor: string;
    category: string;
    image:string;
    price:string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const courseData: CourseData = {
        title: courseTitle,
        description: courseDescription,
        instructor: courseInstructor,
        category: courseCategory,
        image:courseImage,
        price:coursePrice
    };

    try {
         await addCourse(courseData);
        // Handle successful addition (e.g., show success message, clear form)
        // alert(response);
        // console.log(response)
        toast("Course Added Successfully")

        setCourseTitle('');
        setCourseDescription('');
        setCourseInstructor('');
        setCourseCategory('');
        setCourseImage('');
        setCoursePrice('')
    } catch (err) {
        console.error('Error adding course:', err);
        alert('Error adding course. Please try again.');
    }
};

  return (
    <div className={styles.container}> 
      <h2>Add Course</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            value={courseTitle} 
            onChange={(e) => setCourseTitle(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea 
            id="description" 
            value={courseDescription} 
            onChange={(e) => setCourseDescription(e.target.value)} 
            required 
            className={styles.textarea} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="instructor">Instructor:</label>
          <input 
            type="text" 
            id="instructor" 
            value={courseInstructor} 
            onChange={(e) => setCourseInstructor(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category:</label>
          <input 
            type="text" 
            id="category" 
            value={courseCategory} 
            onChange={(e) => setCourseCategory(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Image:</label>
          <input 
            type="text" 
            id="image" 
            value={courseImage} 
            onChange={(e) => setCourseImage(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price:</label>
          <input 
            type="text" 
            id="image" 
            value={coursePrice} 
            onChange={(e) => setCoursePrice(e.target.value)} 
            required 
            className={styles.input} 
          />
        </div>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Adding...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;