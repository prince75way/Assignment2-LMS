import React, { useEffect, useState } from 'react';
import styles from './ModuleCard.module.css';
import { useCheckEnrollmentQuery } from '../../services/userServices'; // Assuming we have this hook from RTK API
import PaymentModal from '../PaymentModal';

interface ModuleCardProps {
  title: string;
  description: string;
  videoUrl: string;
  courseId: string; // Passing courseId as a prop
  price: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, videoUrl, courseId, price }) => {
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // For skeleton loading

  const accessToken = localStorage.getItem('accessToken') || ''; // Replace with actual access token
  const { data } = useCheckEnrollmentQuery({ accessToken, courseId });

  // Check if the user is enrolled
  useEffect(() => {
    // Simulate skeleton for 5 seconds before setting data
    const timeout = setTimeout(() => {
      if (data && data?.data?.enrolled !== undefined) {
        setIsEnrolled(data.data.enrolled);
        setIsLoading(false); // Hide skeleton after 5 seconds
      } else {
        setIsEnrolled(false);
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout); // Clean up timeout if the component unmounts
  }, [data]);

  const handleEnroll = () => {
    setModalOpen(true);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.card}>
      <div className={styles.textContainer}>
        {isLoading ? (
          <div className={`${styles.skeleton} ${styles.titleSkeleton}`} />
        ) : (
          <h3 className={styles.title}>{title}</h3>
        )}
        {isLoading ? (
          <div className={`${styles.skeleton} ${styles.descriptionSkeleton}`} />
        ) : (
          <p className={styles.description}>
            {isEnrolled === false ? description.slice(0, 100) + '...' : description}
          </p>
        )}
      </div>

      <div className={styles.videoContainer}>
        {isLoading ? (
          <div className={`${styles.skeleton} ${styles.videoSkeleton}`} />
        ) : (
          <div
            className={`${styles.videoWrapper} ${isEnrolled === false ? '' : styles.enrolled}`}
          >
            {isEnrolled === false ? (
              <div className={styles.lockOverlay}>
                <span className={styles.lockIcon}>🔒</span>
              </div>
            ) : (
              <video src={videoUrl} controls className={styles.video} />
            )}
            {/* Enroll button over the video */}
            {isEnrolled === false && !isLoading && (
              <button className={styles.enrollButton} onClick={handleEnroll}>
                Enroll to Course
              </button>
            )}
          </div>
        )}
      </div>

      {modalOpen && <PaymentModal open={modalOpen} onClose={closeModal} coursePrice={price} courseId={courseId} />}
    </div>
  );
};

export default ModuleCard;
