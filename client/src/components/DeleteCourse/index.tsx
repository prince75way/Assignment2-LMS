import React, { useState, useEffect } from 'react';
import styles from './DeleteCourse.module.css'; // Import CSS modules
import { useGetCoursesQuery, useDeleteCourseMutation, useEditCourseMutation } from '../../services/courseServices';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Import React Icons

const CourseList = () => {
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();
  const [editCourse, { isSuccess: isEditSuccess }] = useEditCourseMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  interface Course {
    _id: string;
    title: string;
    description: string;
    image: string;
    category:string
  }

  useEffect(() => {
    if (isEditSuccess) {
      setIsEditMode(false);
      
  
      toast.success('Course updated successfully!');
      
      setTimeout(() => {
        window.location.reload();
        
      }, 2000);
    }
  }, [isEditSuccess]);

  const handleDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete);
        toast.success('Course deleted successfully!');
        setIsDeleteConfirmVisible(false);
        setCourseToDelete(null);
        window.location.reload();
      } catch (err) {
        console.error('Error deleting course:', err);
        toast.error('Failed to delete the course.');
      }
    }
  };

  const handleEditCourse = (course: Course) => {
    setIsEditMode(true);
    setEditedCourse({ ...course });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedCourse) {
      setEditedCourse({ ...editedCourse, [e.target.name]: e.target.value });
    }
  };

  const handleDeleteIconClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsDeleteConfirmVisible(true);
  };

  const handleSaveEdit = async () => {
    if (editedCourse) {
      try {
        await editCourse(editedCourse);
        // toast.success('Course updated successfully!');
      } catch (err) {
        console.error('Error updating course:', err);
        toast.error('Failed to update the course.');
      }
    }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p>Error fetching courses: {error instanceof Error ? error.message : 'Unknown error'}</p>
      ) : (
        <div className={styles.courseList}>
          {coursesData &&
            coursesData.map((course: Course) => (
              <div key={course._id} className={styles.courseItem}>
                <img src={course.image} alt={course.title} className={styles.courseImage} />
                <div className={styles.courseDetails}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseDescription}>{course.description}</p>
                  <div className={styles.icons}>
                    <FiEdit
                      className={`${styles.icon} ${styles.editIcon}`}
                      onClick={() => handleEditCourse(course)}
                    />
                    <FiTrash2
                      className={`${styles.icon} ${styles.deleteIcon}`}
                      onClick={() => handleDeleteIconClick(course._id)}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {isDeleteConfirmVisible && (
        <div className={styles.deleteModal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to delete this course?</p>
            <div className={styles.modalActions}>
              <button onClick={handleDeleteCourse} className={styles.confirmButton}>
                Yes
              </button>
              <button onClick={() => setIsDeleteConfirmVisible(false)} className={styles.cancelButton}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditMode && (
        <div className={styles.editModal}>
          <div className={styles.modalContent}>
            <h2>Edit Course</h2>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editedCourse?.title || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={editedCourse?.description || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="category">Category:</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={editedCourse?.category || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="image">Image:</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={editedCourse?.image || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={handleSaveEdit} className={styles.saveButton}>
                  Save
                </button>
                <button type="button" onClick={() => setIsEditMode(false)} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
