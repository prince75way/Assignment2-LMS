
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InstructorLoginResponse } from '../../services/instructorService'; // Import the login response from the service
import { instructorService } from '../../services/instructorService'; // Import the instructor service

// Define the initial state for the instructor
interface InstructorState {
  instructor: {
    name: string;
    email: string;
    accessToken: string;
    refreshToken:string
  } | null;
  isAuthenticated: boolean;
  role:string |null;
  error: string | null;
  loading: boolean;
}

const initialState: InstructorState = {
  instructor: null,
  isAuthenticated: false,
  error: null,
  role:null,
  loading: false,
};

// Create the instructor slice
const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    setInstructor: (state, action: PayloadAction<InstructorLoginResponse['data'] & { role: string }>) => {
      state.instructor = { ...action.payload };
      state.isAuthenticated = true;
      state.role='instructor';
      state.error = null;
    },
    logout: (state) => {
      state.instructor = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // If login succeeds
      .addMatcher(
        instructorService.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<InstructorLoginResponse>) => {
          const { payload } = action;
          state.instructor = { ...payload.data };  // Save instructor data
          state.isAuthenticated = true;  // Set authentication to true
          state.error = null;  // Clear any previous error
        }
      )
      // If login fails
      .addMatcher(
        instructorService.endpoints.login.matchRejected,
        (state, action) => {
          const error = action.payload;
          if (error && 'data' in error) {
            state.error = (error.data as { error: string }).error || 'Login failed';
          } else {
            state.error = 'Login failed';
          }
          state.isAuthenticated = false;
        }
      );
  },
});

// Export the actions from the slice
export const { setInstructor, logout, setLoading, setError } = instructorSlice.actions;

// Export the reducer
export default instructorSlice.reducer;
