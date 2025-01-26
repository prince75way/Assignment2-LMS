import { useParams, useLocation } from 'react-router-dom';
import { useGetModulesByCourseIdQuery } from '../services/moduleService';
import ModuleCard from '../components/ModuleCard'; // Import the new component

export const CourseModulesPage = () => {
  const { courseName } = useParams(); // Get course name from the dynamic URL
  const location = useLocation(); // Access location object
  const courseId = location.state?.courseId; // Retrieve courseId from state
  const price = location.state?.price; 
  if (!courseId) return <p>Invalid course or missing course ID</p>;



  // Use the hook to fetch modules by courseId
  const { data: modules, isLoading, error } = useGetModulesByCourseIdQuery(courseId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as any)?.data?.message || 'Something went wrong'}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Modules of Course: {courseName}</h1>
      {modules?.map((module: any) => (
        <ModuleCard
          key={module._id}
          title={module.title}
          description={module.description}
          videoUrl={module.videoUrl}
          courseId={courseId}
          price={price}
        />
      ))}
    </div>
  );
};

export default CourseModulesPage;
