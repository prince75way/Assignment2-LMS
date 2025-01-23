import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  selectedCourseId: string | null; // Track which course is selected
  filterCategory: string; // Track the current category filter
}

const initialState: CourseState = {
  selectedCourseId: null,
  filterCategory: "all", // Default filter
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    selectCourse: (state, action: PayloadAction<string>) => {
      state.selectedCourseId = action.payload;
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    },
    clearSelection: (state) => {
      state.selectedCourseId = null;
    },
  },
});

export const { selectCourse, setFilterCategory, clearSelection } = courseSlice.actions;

export default courseSlice.reducer;
