import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOrder, getOrdersSync } from "./orderAction";
import { RootState } from "../store";

export interface OrderItem {
  OrderNO: string;
  Sno: number;
  ItemCode: string;
  Description: string;
  Rate: number;
  Qty: number;
  Amount: number;
  Status: string;
}

export interface OrderState {
  orders: OrderItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderItems(state, action: PayloadAction<OrderItem[]>) {
      state.orders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersSync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getOrdersSync.fulfilled,
        (state, action: PayloadAction<OrderItem[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(getOrdersSync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong";
      })
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { setOrderItems } = orderSlice.actions;
export const getOrderItemCount = (state: RootState) =>
  state.order.orders.length;
export const getOrderTotal = (state: RootState) =>
  state.order.orders.reduce((total, item) => total + item.Amount, 0);
export default orderSlice.reducer;
