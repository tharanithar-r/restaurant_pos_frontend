import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  deleteCartItem,
  getCartSync,
  updateCart,
  updateQtyAndSync,
} from "./cartAction";
import { RootState } from "../store";

export interface CartItem {
  ItemCode: string;
  Description: string;
  MaxRate: number;
  Qty: number;
  Amount: number;
}

export interface CartState {
  cart: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateQty(state, action: PayloadAction<{ ItemCode: string; Qty: number }>) {
      const { ItemCode, Qty } = action.payload;
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.ItemCode === ItemCode
            ? { ...item, Qty, Amount: Qty * item.MaxRate }
            : item
        ),
      };
    },
    resetCart: (state) => {
      state.cart = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Update Cart
      .addCase(updateCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "succeeded";
          state.cart = action.payload;
          state.error = null;
        }
      )
      .addCase(
        updateCart.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload ?? "Something went wrong";
        }
      )

      //Update Quantity and Sync
      .addCase(updateQtyAndSync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateQtyAndSync.fulfilled, (state, action) => {
        const updatedItems = action.payload;
        updatedItems.forEach((updatedItem: CartItem) => {
          const index = state.cart.findIndex(
            (item) => item.ItemCode === updatedItem.ItemCode
          );
          if (index !== -1) {
            state.cart[index] = updatedItem;
          }
        });
        state.error = null;
      })
      .addCase(updateQtyAndSync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to update quantity";
      })

      //Get Cart Sync
      .addCase(getCartSync.pending, (state) => {
        state.status = "loading";
        state.cart = [];
        state.error = null;
      })
      .addCase(
        getCartSync.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "succeeded";
          state.cart = action.payload;
          state.error = null;
        }
      )
      .addCase(getCartSync.rejected, (state, action) => {
        state.status = "failed";
        state.cart = [];
        state.error = action.payload ?? "Something went wrong";
      })

      //Delete Cart Item
      .addCase(deleteCartItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload?.remainingItems === 0) {
          state.cart = [];
        }
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { updateQty, resetCart } = cartSlice.actions;

export const getCartItemCount = (state: RootState) => state.cart.cart.length;
export const getCartTotal = (state: RootState) =>
  state.cart.cart.reduce((total, item) => total + item.Amount, 0);
export default cartSlice.reducer;
