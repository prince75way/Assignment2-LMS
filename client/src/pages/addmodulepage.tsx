import { useLocation } from 'react-router-dom';
import AddModuleForm from "../components/AddModuleForm";

function ModuleAddPage() {
  const location = useLocation(); // Access location object
  const courseId = location.state?.courseId; // Retrieve courseId passed via navigate

  if (!courseId) return <p>No course ID provided</p>; // Handle missing courseId
  
  return (
    <div>
      <AddModuleForm courseId={courseId} />
    </div>
  );
}

export default ModuleAddPage;
