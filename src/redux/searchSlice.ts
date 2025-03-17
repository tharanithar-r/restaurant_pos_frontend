import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface searchState {
  searchQuery: string;
}

const initialState: searchState = {
  searchQuery: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchquery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchquery } = searchSlice.actions;

export default searchSlice.reducer;
