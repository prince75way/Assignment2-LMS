import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme } from '@mui/material/styles';
import { Button, Typography, TextField, Container, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useSignupMutation } from '../services/userServices'; // Import user service hooks
import { setUser } from '../redux/slices/userSlice'; // Import authSlice actions
import { useForm, Controller } from 'react-hook-form'; // Import React Hook Form
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function UserAuth() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between signup and login

  // Use the login and signup hooks from userService
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();
  const [signup, { isLoading: isSigningUp, error: signupError }] = useSignupMutation();

  // Initialize React Hook Form with default values
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',  // Set default value for name as empty string
      tandc: false,  // Set default value for tandc as false
    },
  });

  // Handle sign in (login) and sign up actions
  interface FormData {
    email: string;
    password: string;
    name?: string;
    tandc?: boolean;
  }

  const navigate=useNavigate()

  const handleSignIn = async (formData: FormData) => {
    const { email, password, name } = formData;
  
    if (isSignUp) {
      try {
        const response = await signup({ name: name || '', email, password }).unwrap();
        dispatch(setUser(response.data)); // Dispatch user data on successful signup
        localStorage.setItem('accessToken', response.data.accessToken); // Store accessToken in localStorage
        localStorage.setItem('refreshToken',response.data.refreshToken)
        toast("Sign-UP Successful");
        setTimeout(() => {
          navigate('/')
        }, 4000);
      } catch (error) {
        // alert((error as any)?.data?.message || 'Error during signup');
      }
    } else {
      try {
        const response = await login({ email, password }).unwrap();
        dispatch(setUser(response.data)); // Dispatch user data on successful login
        localStorage.setItem('accessToken', response.data.accessToken); // Store accessToken in localStorage
        localStorage.setItem('refreshToken',response.data.refreshToken)
        toast("Login Successful");

        setTimeout(() => {
          navigate('/')
        }, 4000);
      } catch (error) {
        // console.log("ERror is : ",error)
      }
    }
  };

  return (
    <AppProvider theme={theme}>
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
          <form onSubmit={handleSubmit(handleSignIn)}>
            {/* Conditional Form Content */}
            {isSignUp && (
              <div>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name?.message}
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
            )}

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
                    helperText={errors.email?.message}
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
                    helperText={errors.password?.message}
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
              disabled={isLoggingIn || isSigningUp}
            >
              {isSignUp ? (isSigningUp ? 'Signing Up...' : 'Sign Up') : (isLoggingIn ? 'Logging In...' : 'Login')}
            </Button>
          </form>

          {/* Error Messages */}
          {loginError && (
            <Typography variant="body2" color="error" align="center" sx={{ marginTop: 2 }}>
              {('data' in loginError ? (loginError as any).data?.message : 'error' in loginError ? (loginError as any).error : 'Unknown error')}
            </Typography>
          )}

          {signupError && (
            <Typography variant="body2" color="error" align="center" sx={{ marginTop: 2 }}>
              {('data' in signupError ? (signupError as any).data?.message : 'error' in signupError ? (signupError as any).error : 'Unknown error')}
            </Typography>
          )}

          {/* Toggle between Login and Signup */}
          <Typography variant="body2" align="center" sx={{ marginTop: 2, color: 'white' }}>
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Button onClick={() => setIsSignUp(false)} color="primary" sx={{ textTransform: 'none' }}>
                  Login
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Button onClick={() => setIsSignUp(true)} color="primary" sx={{ textTransform: 'none' }}>
                  Sign Up
                </Button>
              </>
            )}
          </Typography>
        </Paper>
      </Container>
    </AppProvider>
  );
}
