import React, { useState, useEffect } from 'react';
import { useGetCoursesQuery, useDeleteCourseMutation, useEditCourseMutation } from '../../services/courseServices';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Import React Icons
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Card, CardContent, CardMedia, Grid, IconButton } from '@mui/material';
import styles from './DeleteCourse.module.css'; // Import CSS modules

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
    category: string;
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
        <Grid container spacing={3}>
          {coursesData &&
            coursesData.map((course: Course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card className={styles.courseItem}>
                  <CardMedia
                    component="img"
                    alt={course.title}
                    height="200"
                    image={course.image}
                    title={course.title}
                    className={styles.courseImage}
                  />
                  <CardContent className={styles.courseDetails}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseDescription}>{course.description}</p>
                    <div className={styles.icons}>
                      <IconButton onClick={() => handleEditCourse(course)}>
                        <FiEdit className={styles.editIcon} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteIconClick(course._id)}>
                        <FiTrash2 className={styles.deleteIcon} />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmVisible} onClose={() => setIsDeleteConfirmVisible(false)}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this course?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCourse} color="primary">
            Yes
          </Button>
          <Button onClick={() => setIsDeleteConfirmVisible(false)} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Modal */}
      <Dialog open={isEditMode} onClose={() => setIsEditMode(false)}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={editedCourse?.title || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={editedCourse?.description || ''}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Category"
            name="category"
            value={editedCourse?.category || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="image"
            value={editedCourse?.image || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
          <Button onClick={() => setIsEditMode(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CourseList;
