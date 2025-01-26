import React, { useState } from 'react';
import { useAddCourseMutation } from '../../services/courseServices'; // Import the hook
import styles from './AddCourseForm.module.css'; // Import CSS Modules
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const AddCourseForm = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [addCourse, { isLoading}] = useAddCourseMutation();
  const navigate=useNavigate()

interface CourseData {
    title: string;
    description: string;
    category: string;
    image:string;
    price:string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const courseData: CourseData = {
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        image:courseImage,
        price:coursePrice
    };

    try {
         const response=await addCourse({accessToken:localStorage.getItem('accessToken') || '', ...courseData});
        // // Handle successful addition (e.g., show success message, clear form)
        // // alert(response);
        // console.log(response)
        if(response.data.success){

          toast("Course Added Successfully")
  
          setTimeout(() => {
            
            setCourseTitle('');
            setCourseDescription('');
            setCourseCategory('');
            setCourseImage('');
            setCoursePrice('')
            navigate('/')
          }, 3000);
        }
        else{
          toast("Some Error Occured!! Try Later")
        }
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