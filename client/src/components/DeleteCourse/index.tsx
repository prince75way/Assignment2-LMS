import React, { useState, useEffect } from 'react';
import styles from './DeleteCourse.module.css'; // Import CSS modules
import { useGetCoursesQuery, useDeleteCourseMutation, useEditCourseMutation } from '../../services/courseServices'; // Import RTK Query hooks
import { toast } from 'react-toastify';

const CourseList = () => {
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({});
  const [deleteCourse, { isSuccess: isDeleteSuccess }] = useDeleteCourseMutation();
  const [editCourse, { isSuccess: isEditSuccess }] = useEditCourseMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (isEditSuccess) {
      setIsEditMode(false);
      // Fetch updated courses after successful edit
      window.location.reload(); 
    }
  }, [isEditSuccess]);

interface Course {
    _id: string;
    title: string;
    description: string;
    image: string;
}

const handleDeleteCourse = async (courseId: string) => {
    try {
        await deleteCourse(courseId);
        // Handle successful deletion (e.g., update courses state, show confirmation)
        if (isDeleteSuccess) {
            toast("Course Deleted Successfully")
        }
    } catch (err) {
        console.error('Error deleting course:', err);
    }
};

interface EditCourse {
    _id: string;
    title: string;
    description: string;
    image: string;
}

const handleEditCourse = (course: EditCourse) => {
    setIsEditMode(true);
    setEditedCourse({ ...course });
};

  const handleSaveEdit = async () => {
    try {
      if (editedCourse) {
        await editCourse(editedCourse);
      }
    } catch (err) {
      console.error('Error editing course:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (editedCourse) {
          setEditedCourse({ ...editedCourse, [e.target.name]: e.target.value } as Course);
      }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p>Error fetching courses: { 'status' in error ? error.status : error.message }</p>
      ) : (
        <div className={styles.courseList}>
          {coursesData && coursesData.map((course: Course) => (
            <div key={course._id} className={styles.courseItem}>
              <img src={course.image} alt={course.title} className={styles.courseImage} /> 
              <div className={styles.courseDetails}>
                <h3>{course.title}</h3>
                <div className={styles.icons}>
                  <span 
                    className={`${styles.icon} ${styles.editIcon}`} 
                    onClick={() => handleEditCourse(course)} 
                  >
                    {/* Edit icon (e.g., pencil icon) */}
                    ✏️ 
                  </span>
                  <span 
                    className={`${styles.icon} ${styles.deleteIcon}`} 
                    onClick={() => handleDeleteCourse(course._id)} 
                  >
                    {/* Delete icon (e.g., trash icon) */}
                    🗑️ 
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditMode && (
        <div className={styles.editModal}> 
          <div className={styles.modalContent}>
            <h2>Edit Course</h2>
            <form>
              <div>
                <label htmlFor="title">Title:</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={editedCourse ? editedCourse.title : ''} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={editedCourse ? editedCourse.description : ''} 
                  onChange={handleInputChange} 
                />
              </div>
              <button type="button" onClick={handleSaveEdit}>Save</button>
              <button type="button" onClick={() => setIsEditMode(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;