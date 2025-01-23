import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface InstructorLoginRequest {
  email: string;
  password: string;
}

export interface InstructorLoginResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    accessToken: string;
  };
}

export const instructorService = createApi({
  reducerPath: 'instructorService',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/instructor' }), // Corrected URL to the right backend endpoint
  endpoints: (builder) => ({
    login: builder.mutation<InstructorLoginResponse, InstructorLoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials, // Sending email and password for login
      }),
    }),
  }),
});

export const { useLoginMutation } = instructorService;
