import { configureStore } from "@reduxjs/toolkit";
import { courseApi } from '../services/courseServices';
import { userService } from '../services/userServices'; // Import user service
import { moduleService } from "../services/moduleService"; // Import module service
import { instructorService } from "../services/instructorService"; // Import instructor service
import courseReducer from "./slices/courseSlice";
import userReducer from './slices/userSlice'; // Import auth slice
import moduleReducer from './slices/moduleSlice';
import instructorReducer from './slices/instructorSlice'; // Import instructor slice
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default is localStorage

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ['user', 'course', 'module', 'instructor'], // Specify which reducers to persist
};

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  // Add the API slices
  [courseApi.reducerPath]: courseApi.reducer,
  [userService.reducerPath]: userService.reducer, // Add user service reducer
  [moduleService.reducerPath]: moduleService.reducer, // Add module service reducer
  [instructorService.reducerPath]: instructorService.reducer, // Add instructor service reducer
  // Add the custom UI slices
  module: moduleReducer,
  course: courseReducer,
  user: userReducer, // Add auth slice reducer
  instructor: instructorReducer, // Add instructor slice reducer
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      courseApi.middleware,
      userService.middleware,
      moduleService.middleware, // Add module service middleware
      instructorService.middleware // Add instructor service middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

export { store, persistor }; // Export persistor for use in PersistGate

export default store;
