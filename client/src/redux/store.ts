import { configureStore } from "@reduxjs/toolkit";
import { courseApi } from '../services/courseServices';
import { userService } from '../services/userServices';  // Import user service
import { moduleService } from "../services/moduleService"; // Import module service
import { instructorService } from "../services/instructorService"; // Import instructor service
import courseReducer from "./slices/courseSlice";
import userReducer from './slices/userSlice';  // Import auth slice
import moduleReducer from './slices/moduleSlice';
import instructorReducer from './slices/instructorSlice';  // Import instructor slice

const store = configureStore({
  reducer: {
    // Add the API slices
    [courseApi.reducerPath]: courseApi.reducer,
    [userService.reducerPath]: userService.reducer,  // Add user service reducer
    [moduleService.reducerPath]: moduleService.reducer, // Add module service reducer
    [instructorService.reducerPath]: instructorService.reducer, // Add instructor service reducer
    // Add the custom UI slices
    module: moduleReducer,
    course: courseReducer,
    auth: userReducer,  // Add auth slice reducer
    instructor: instructorReducer,  // Add instructor slice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      courseApi.middleware,
      userService.middleware,
      moduleService.middleware, // Add module service middleware
      instructorService.middleware // Add instructor service middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
