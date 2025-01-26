import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useGetModulesByCourseIdQuery } from '../services/moduleService';
import ModuleCard from '../components/ModuleCard';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button } from '@mui/material';

export const CourseModulesPage = () => {
  const { courseName } = useParams(); // Get course name from the dynamic URL
  const location = useLocation(); // Access location object
  const courseId = location.state?.courseId; // Retrieve courseId from state
  const price = location.state?.price; 
  const navigate = useNavigate(); // Initialize navigate for navigation

  if (!courseId) return <p>Invalid course or missing course ID</p>;

  const { isAuthenticated: isInstructorAuthenticated } = useSelector(
    (state: RootState) => state.instructor
  );
  
  // Use the hook to fetch modules by courseId
  const { data: modules, isLoading, error } = useGetModulesByCourseIdQuery(courseId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return (
    <>
      <p> {(error as any)?.data?.message || 'Something went wrong'}</p>
      {isInstructorAuthenticated && (
        <Button
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#007bff')}
          onMouseDown={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1.05)')}
          onMouseUp={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1)')}
          onClick={() => navigate('/instructor/addmodule', { state: { courseId } })} // Navigate to /addmodule and pass courseId
        >
          ADD MODULES
        </Button>
      )}
    </>
  );

  const isWideScreen = window.innerWidth > 768; // Define isWideScreen based on window width

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
          Modules of Course: {courseName}
        </h1>
        {isInstructorAuthenticated && (
          <Button
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              padding: '10px 20px',
              borderRadius: '5px',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
            }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#007bff')}
            onMouseDown={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1.05)')}
            onMouseUp={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1)')}
            onClick={() => navigate('/instructor/addmodule', { state: { courseId } })} // Navigate to /addmodule and pass courseId
          >
            ADD MODULES
          </Button>
        )}
      </div>

      <div
  className="moduleGrid"
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'space-between',
  }}
>
  {modules?.map((module: any) => (
    <div
      key={module._id}
      style={{
        flex: `1 1 ${isWideScreen ? 'calc(50% - 32px)' : '100%'}`, // Adjust width based on screen size
        marginBottom: '16px',
        // To prevent layout shift and ensure consistent sizing
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <ModuleCard
       
        title={module.title}
        description={module.description}
        videoUrl={module.videoUrl}
        courseId={courseId}
        price={price}
        moduleId={module._id} // Added moduleId
      />
    </div>
  ))}
</div>
</div>

  );
};

export default CourseModulesPage;
