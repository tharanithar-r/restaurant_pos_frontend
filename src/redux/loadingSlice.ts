import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
  activeStates: string[];
}

const initialState: LoadingState = {
  isLoading: false,
  activeStates: [],
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setStateLoading: (state, action: PayloadAction<string>) => {
      state.activeStates.push(action.payload);
      state.isLoading = true;
    },
    clearStateLoading: (state, action: PayloadAction<string>) => {
      state.activeStates = state.activeStates.filter(
        (s) => s !== action.payload
      );
      state.isLoading = state.activeStates.length > 0;
    },
  },
});

export const { setStateLoading, clearStateLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
