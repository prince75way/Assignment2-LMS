import React, { useEffect, useState } from 'react';
import styles from './ModuleCard.module.css';
import { useCheckEnrollmentQuery } from '../../services/userServices'; // Assuming we have this hook from RTK API


interface ModuleCardProps {
  title: string;
  description: string;
  videoUrl: string;
  courseId: string; // Passing courseId as a prop
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, videoUrl, courseId }) => {
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);

  const accessToken = localStorage.getItem('accessToken') || ''; // Replace with actual access token
  const { data } = useCheckEnrollmentQuery({ accessToken, courseId });
  console.log(data)

  // Check if the user is enrolled
  useEffect(() => {
    if (data?.enrolled !== undefined) {
      setIsEnrolled(data.enrolled);
    }
  }, [data]);

  const handleEnroll = () => {
    // Implement the enrollment logic here
    console.log('Redirecting to enrollment page...');
  };

  return (
    <div className={styles.card}>
      <div className={styles.textContainer}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.videoContainer}>
        <div className={`${styles.videoWrapper} ${isEnrolled === false ? styles.blur : ''}`}>
          <video src={videoUrl} controls className={styles.video} />
        </div>
        {isEnrolled === false && (
          <button className={styles.enrollButton} onClick={handleEnroll}>
            Enroll to Course
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
