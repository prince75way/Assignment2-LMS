import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Skeleton } from '@mui/material';
import { useProgressQuery } from '../services/userServices'; // Adjust this import path

const ProgressPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Get the access token from localStorage
  const accessToken = localStorage.getItem('accessToken');

  // Use the useProgressQuery to fetch the progress data
  const { data, isLoading, error } = useProgressQuery({ accessToken: accessToken || '' }, {
    skip: !showProgress, // Only fetch progress if showProgress is true
  });

  const handleButtonClick = () => {
    if (accessToken) {
      setShowProgress(true);
      setModalOpen(true);
    } else {
      alert("You need to log in first.");
    }
  };

  return (
    <Box sx={{ textAlign: 'center', padding: '20px' }}>
      <Button
        variant="contained"
        color="primary"
        sx={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '30px',
          boxShadow: '0 0 15px rgba(0, 0, 255, 0.5)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 25px rgba(0, 0, 255, 0.8)',
          },
        }}
        onClick={handleButtonClick}
      >
        Check Progress Report
      </Button>

      {/* Modal to show the progress */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
          maxWidth: '600px',
          width: '80%',
        }}>
          <Typography variant="h6" sx={{ marginBottom: '20px', fontSize: '20px' }}>
            Your Progress Report
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Skeleton variant="text" width="100%" height={50} />
              <Skeleton variant="text" width="80%" height={50} />
              <Skeleton variant="text" width="60%" height={50} />
            </Box>
          ) : error ? (
            <Typography color="error">
              Error: {error && 'status' in error ? error.status : error?.message || 'An unknown error occurred'}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {data?.data?.map((progress) => (
                <Box
                  key={progress.courseId}
                  sx={{
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: '18px', marginBottom: '10px' }}>
                    {progress.courseTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                    Total Modules: {progress.totalModules}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                    Watched Modules: {progress.watchedModules}
                  </Typography>
                  <Typography variant="body2">
                    Progress: {progress.progressPercentage}%
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProgressPage;
