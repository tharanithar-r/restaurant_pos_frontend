import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllKitchenOrders, prepareItem } from "./kitchenActions";
import { RootState } from "../store";

interface KitchenOrder {
  OrderNO: string;
  OrderDate: Date;
  TableNo: string;
  Status: string;
  Sno: number;
  ItemCode: string;
  Qty: number;
  Description: string;
}

interface KitchenState {
  orders: KitchenOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: KitchenState = {
  orders: [],
  status: "idle",
  error: null,
};

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllKitchenOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllKitchenOrders.fulfilled,
        (state, action: PayloadAction<KitchenOrder[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAllKitchenOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(prepareItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(prepareItem.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(prepareItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default kitchenSlice.reducer;

// Selectors
export const getAllKitchenOrders = (state: RootState) => state.kitchen.orders;
export const getKitchenStatus = (state: RootState) => state.kitchen.status;
export const getKitchenError = (state: RootState) => state.kitchen.error;
