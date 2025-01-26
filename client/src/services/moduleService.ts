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
    addModule: builder.mutation({
      query: ({ title, courseId, description, contentText, video }: { title: string; courseId: string; description: string; contentText: string; video: File }) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("contentText", contentText);
        formData.append("video", video);  // Assuming 'video' is a file object from the user's input
    
        return {
          url: `/module/create/${courseId}`,  // POST /course endpoint
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            // Don't manually set the Content-Type header; FormData will handle it
          },
          body: formData,  // Send the form data
        };
      },
    }),
    
    
  }),
});

// Export hooks for the endpoints
export const { useGetModulesByCourseIdQuery,useAddModuleMutation } = moduleService;
