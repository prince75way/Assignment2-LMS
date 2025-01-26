import { useLoginMutation } from '../services/instructorService';
import { useDispatch } from 'react-redux';
import { setInstructor } from '../redux/slices/instructorSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form'; // Import React Hook Form
import { Checkbox } from '@mui/material';

export default function InstructorLoginPage() {
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Provide default values for each form field
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '', // Ensure email starts as an empty string
      password: '', // Ensure password starts as an empty string
      tandc: false, // Default value for checkbox
    },
  });

  // Handle instructor login
  const handleSubmitForm = async (formData: any) => {
    const { email, password } = formData;

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setInstructor({ ...response.data, role: 'instructor' }));
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken',response.data.refreshToken);
      toast("Login Successful");
      navigate('/');
    } catch (error) {
      alert((error as any)?.data?.message || 'Error during login');
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper
        sx={{
          padding: 4,
          width: '100%',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#353030', // Dark background for the form
        }}
      >
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {/* Login Form */}
          <div>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message?.toString()}
                  sx={{
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00bcd4',
                      },
                    },
                  }}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message?.toString()}
                  sx={{
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00bcd4',
                      },
                    },
                  }}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="tandc"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  color="primary"
                  sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                />
              )}
            />
            <Typography variant="body2" color="textSecondary" sx={{ display: 'inline' }}>
              I agree with the T&C
            </Typography>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: '#00bcd4',
              '&:hover': {
                backgroundColor: '#008c8c',
              },
            }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Logging In...' : 'Login'}
          </Button>
        </form>

        {/* Error Messages */}
        {loginError && (
          <Typography variant="body2" color="error" align="center" sx={{ marginTop: 2 }}>
            {('data' in loginError ? (loginError as any).data?.message : 'error' in loginError ? (loginError as any).error : 'Unknown error')}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
