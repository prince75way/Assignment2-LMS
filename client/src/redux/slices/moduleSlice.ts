import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

export const { setModules, setLoading, setError } = moduleSlice.actions;
export default moduleSlice.reducer;
