import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, fetchItems } from "./menuActions";

export interface MenuItem {
  ItemCode: string;
  Description: string;
  MaxRate: number;
  ItemImage: string;
}

export interface Category {
  Category: string;
}

interface MenuState {
  items: MenuItem[];
  categories: Category[];
  selectedCategory: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  selectedCategory: "All",
  status: "idle",
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { setSelectedCategory } = menuSlice.actions;
export default menuSlice.reducer;
