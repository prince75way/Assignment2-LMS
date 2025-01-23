import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api", // Replace with your backend base URL
  }),
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => "/course", // GET /courses endpoint
    }),
    deleteCourse: builder.mutation({
      query: (courseId: string) => ({
        url: `/course/${courseId}`, // DELETE /course/:courseId endpoint
        method: 'DELETE',
      }),
    }),
    editCourse: builder.mutation({
      query: (course: { _id: string, title: string, description: string }) => ({
        url: `/course/${course._id}`, // PUT /course/:courseId endpoint
        method: 'PUT',
        body: {
          title: course.title,
          description: course.description,
        },
      }),
    }),
    addCourse: builder.mutation({
      query: (course: { title: string, description: string,price:string, instructor: string, category: string,image:string }) => ({
        url: '/course/', // POST /course endpoint
        method: 'POST',
        body: {
          title: course.title,
          description: course.description,
          instructor: course.instructor,
          category: course.category,
          image:course.image,
          price:course.price
        },
      }),
    }),
  }),
});

export const { 
  useGetCoursesQuery, 
  useDeleteCourseMutation, 
  useEditCourseMutation,
  useAddCourseMutation 
} = courseApi;

