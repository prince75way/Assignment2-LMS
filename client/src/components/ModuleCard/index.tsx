import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box, Skeleton } from "@mui/material";
import { useCheckEnrollmentQuery, useWatchedModuleMutation } from "../../services/userServices";
import PaymentModal from "../PaymentModal";
import styles from "./ModuleCard.module.css";

interface ModuleCardProps {
  title: string;
  description: string;
  videoUrl: string;
  courseId: string;
  price: number;
  moduleId: string; // Added moduleId
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  videoUrl,
  courseId,
  price,
  moduleId
}) => {
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isWatched, setIsWatched] = useState(false); // State for watched status

  const accessToken = localStorage.getItem("accessToken") || "";

  const { data } = useCheckEnrollmentQuery({ accessToken, courseId });

  // Mutation for marking a module as watched
  const [markWatched] = useWatchedModuleMutation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (data?.data?.enrolled !== undefined) {
        setIsEnrolled(data.data.enrolled);
        setIsLoading(false);
      } else {
        setIsEnrolled(false);
        setIsLoading(false);
      }
    }, 4000); // Skeleton for 4 seconds

    return () => clearTimeout(timeout);
  }, [data]);

  // Handler for when the video ends
  const handleVideoEnd = async () => {
    if (isEnrolled) {
      try {
        await markWatched({ accessToken, moduleId, courseId }).unwrap(); // Call the mutation
        setIsWatched(true); // Update watched status locally
      } catch (error) {
        console.error("Failed to mark module as watched:", error);
      }
    }
  };

  const handleEnroll = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <Card className={styles.card}>
      <CardContent className={styles.content}>
        {isLoading ? (
          <Skeleton variant="text" width="80%" height={30} />
        ) : (
          <Typography variant="h6" className={styles.title}>
            {title}
          </Typography>
        )}
        {isLoading ? (
          <Skeleton variant="text" width="100%" height={20} />
        ) : (
          <Typography variant="body2" className={styles.description}>
            {isEnrolled
              ? description
              : description.slice(0, 100) + "..."}
          </Typography>
        )}
      </CardContent>

      <Box className={styles.videoContainer}>
        {isEnrolled === false && !isLoading && (
          <Box className={styles.lockOverlay}>
            <span className={styles.lockIcon}>🔒</span>
            <Button
              variant="contained"
              color="primary"
              className={styles.enrollButton}
              onClick={handleEnroll}
            >
              Enroll to Course
            </Button>
          </Box>
        )}
        <video
          src={videoUrl}
          controls={!!isEnrolled}
          className={`${styles.video} ${
            !isEnrolled ? styles.blurredVideo : ""
          }`}
          onEnded={handleVideoEnd} // Trigger API call on video end
        />
      </Box>

      {/* Show "Watched" tag if the video has been watched */}
      {isWatched && (
        <Typography
          variant="caption"
          sx={{
            display: "inline-block",
            marginTop: "8px",
            padding: "4px 8px",
            backgroundColor: "#4caf50",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Watched
        </Typography>
      )}

      {modalOpen && (
        <PaymentModal
          open={modalOpen}
          onClose={closeModal}
          coursePrice={price}
          courseId={courseId}
        />
      )}
    </Card>



      


  );
};

export default ModuleCard;
