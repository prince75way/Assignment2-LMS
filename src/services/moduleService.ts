import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API endpoints
export const moduleService = createApi({
  reducerPath: 'moduleService',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api', // Replace this with your backend base URL
   
  }),
  endpoints: (builder) => ({
    // Fetch modules based on course ID
    getModulesByCourseId: builder.query({
      query: (courseId: string) => `/module/${courseId}`, // Use the courseId in the route
    }),
  }),
});

// Export hooks for the endpoints
export const { useGetModulesByCourseIdQuery } = moduleService;
