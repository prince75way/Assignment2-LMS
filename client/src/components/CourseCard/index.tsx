
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
  image?:string;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const moduleCount = course.modules ? course.modules.length : 0;
  const navigate=useNavigate()
  
  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* Image Section */}
      <CardMedia
        sx={{ height: 140 }}
        image={course.image}
        title={course.title}
      />
      
      {/* Course Content */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {course.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {course.description}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Start Date: {new Date(course.createdAt).toLocaleDateString()}
        </Typography>

        {/* Show number of modules if available */}
        {moduleCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            Modules: {moduleCount}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small" onClick={() => {

  navigate(`/courses/${course.title}`, { state: { courseId: course._id } });
}}
>Learn More</Button>
      </CardActions>
    </Card>
  );
}
