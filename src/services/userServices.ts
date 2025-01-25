import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../redux/slices/userSlice';

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  data: {
    name: string;
    email: string;
    accessToken: string;
    refreshToken:string;
  };
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    accessToken: string;
    refreshToken:string;
  };
}

// Define the response structure for checking enrollment
export interface EnrolledResponse {
  success: boolean;
  message: string;
  data: {
    enrolled:boolean
  }; // Adjusted to match your response
}

// Create a base query function
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/user",
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Enhanced base query to handle token refresh
const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {

  // Add accessToken to the request body (this is the key part)
  if (typeof args !== 'string' && args.body) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      args.body = { ...args.body, accessToken };
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  // console.log("result is: ",result)

  // If accessToken has expired (403), handle token refresh
  if (result?.error?.status === 401) {
    console.warn('Access token expired, trying to refresh token...');

    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Attempt to refresh the access token
      interface RefreshResponse {
        accessToken: string;
      }

      const refreshResult = await baseQuery(
        {
          url: '/user/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const { accessToken } = refreshResult.data as RefreshResponse;

        // Update the tokens in localStorage
        localStorage.setItem('accessToken', accessToken);

        // Retry the original query with the new accessToken in the body
        if (typeof args !== 'string' && args.body) {
          args.body = { ...args.body, accessToken }; // Attach the new accessToken
        }
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Tokens are invalid; clear localStorage and handle logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        api.dispatch(logout()); // Dispatch logout action
        console.warn('Refresh token is invalid, logging out...');
      }
    } else {
      console.warn('No refresh token found, logging out...');
      api.dispatch(logout()); // Dispatch logout if no refresh token
    }
  }

  return result;
};

export const userService = createApi({
  reducerPath: 'authService',
  baseQuery: baseQueryWithReauth, // Adjust your API base URL
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (newUser) => ({
        url: '/signup',
        method: 'POST',
        body: newUser,
      }),
    }),
    // API to check if the user is enrolled in a course
    checkEnrollment: builder.query<EnrolledResponse, { accessToken: string; courseId: string }>({
      query: ({accessToken,courseId} ) => ({
        url: '/check-enrollment', // Adjust API route accordingly
        method: 'POST',
        body: {accessToken, courseId },
      }),
    }),
    logout: builder.query<EnrolledResponse, { accessToken: string }>({
      query: (accessToken) => ({
        url: '/logout', // Adjust API route accordingly
        method: 'POST',
        body: { accessToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useCheckEnrollmentQuery } = userService;
