import  { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import { useNavigate } from 'react-router-dom';

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
  image?: string;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading for 2 seconds (or until course data is loaded)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const moduleCount = course.modules ? course.modules.length : 0;

  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* Skeleton Loader for Image */}
      {loading ? (
        <Skeleton sx={{ height: 140 }} animation="wave" variant="rectangular" />
      ) : (
        <CardMedia
          sx={{ height: 140 }}
          image={course.image}
          title={course.title}
        />
      )}

      {/* Course Content */}
      <CardContent>
        {/* Skeleton Loader for Title */}
        {loading ? (
          <Skeleton variant="text" width="60%" height={30} animation="wave" />
        ) : (
          <Typography gutterBottom variant="h5" component="div">
            {course.title}
          </Typography>
        )}

        {/* Skeleton Loader for Description */}
        {loading ? (
          <Skeleton variant="text" width="80%" height={20} animation="wave" />
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {course.description}
          </Typography>
        )}

        {/* Skeleton Loader for Date */}
        {loading ? (
          <Skeleton variant="text" width="50%" height={20} animation="wave" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Start Date: {new Date(course.createdAt).toLocaleDateString()}
          </Typography>
        )}

{loading ? (
          <Skeleton variant="text" width="50%" height={20} animation="wave" />
        ) : (
          <Typography variant="body2" color="text.secondary">
          Price: {course.price}
          </Typography>
        )}

        {/* Show number of modules if available */}
        {moduleCount > 0 && !loading && (
          <Typography variant="body2" color="text.secondary">
            Modules: {moduleCount}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions>
        <Button size="small">Share</Button>
        <Button
          size="small"
          onClick={() => {
            navigate(`/courses/${course.title}`, { state: { courseId: course._id,price:course.price } });
          }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
