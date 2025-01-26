import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { moduleService } from '../../services/moduleService'; // Import the moduleService and addModule action
 // Assuming you have a store set up
interface Module {
  _id: string;
  title: string;
  description: string;
  contentText: string;
  videoUrl: string;
  courseId: string;
}

interface ModuleState {
  modules: Module[];
  loading: boolean;
  error: string | null;
}

const initialState: ModuleState = {
  modules: [],
  loading: false,
  error: null,
};

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    setModules(state, action: PayloadAction<Module[]>) {
      state.modules = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(moduleService.endpoints.addModule.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(moduleService.endpoints.addModule.matchFulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can update the modules list after adding a new one
        state.modules.push(action.payload); // Assuming the response is the added module
      })
      .addMatcher(moduleService.endpoints.addModule.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add the module';
      });
  },
});

export const { setModules, setLoading, setError } = moduleSlice.actions;
export default moduleSlice.reducer;
