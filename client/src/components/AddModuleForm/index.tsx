import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAddModuleMutation } from '../../services/moduleService'; // Assuming you have the mutation hook set up
import { setLoading, setError } from '../../redux/slices/moduleSlice'; // Import your slice actions
import { TextField, Button, Container, Grid, Typography, Box, CircularProgress, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface AddModuleFormProps {
  courseId: string;
}

const AddModuleForm: React.FC<AddModuleFormProps> = ({ courseId }) => {
  const navigate=useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentText, setContentText] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const [addModule, { isLoading, error }] = useAddModuleMutation();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setErrorMessage('Please select a video file.');
      return;
    }

    const moduleData = {
      title,
      courseId,
      description,
      contentText,
      video: videoFile,
    };

    try {
      dispatch(setLoading(true));
     const response= await addModule(moduleData);

     if(response.data.success){
      toast.success("Module Added SuccessFully");

      setTimeout(() => {
        navigate('/')
      }, 4000);
     }
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setError('Failed to add module.'));
      setErrorMessage('An error occurred while adding the module.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
  

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Module Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Content Text"
              variant="outlined"
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              required
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Upload Video</InputLabel>
              <input
                accept="video/*"
                type="file"
                onChange={handleVideoChange}
                style={{ display: 'none' }}
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <Button variant="contained" component="span" fullWidth>
                  Choose Video
                </Button>
              </label>
              {videoFile && (
                <FormHelperText>Selected file: {videoFile.name}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {errorMessage && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{ marginTop: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Add Module'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {error && (
        <Box sx={{ marginTop: 2, color: 'red', textAlign: 'center' }}>
          <Typography variant="body2">{error?.toString()}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default AddModuleForm;
