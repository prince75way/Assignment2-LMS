import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  };
}

// Define the response structure for checking enrollment
export interface EnrolledResponse {
  success: boolean;
  message: string;
  enrolled: boolean; // Adjusted to match your response
}

export const userService = createApi({
  reducerPath: 'authService',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user' }), // Adjust your API base URL
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
      query: (courseId ) => ({
        url: '/check-enrollment', // Adjust API route accordingly
        method: 'POST',
        body: { accessToken:localStorage.getItem('accessToken'), courseId },
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useCheckEnrollmentQuery } = userService;
