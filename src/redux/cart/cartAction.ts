import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { CartItem } from "./cartSlice";
import { RootState } from "../store";

const backendURL = import.meta.env.VITE_BACKEND_URL;

interface DeleteCartResponse {
  success: boolean;
  remainingItems: number;
}

export const updateCart = createAsyncThunk<
  CartItem[],
  CartItem | CartItem[],
  { rejectValue: string; state: RootState }
>("cart/updateCart", async (items, { getState, rejectWithValue }) => {
  try {
    const { customer, table } = getState();
    const customerID = customer.CustomerID;
    const tableNo = table.currentTable;

    if (!customerID) {
      return rejectWithValue("Customer ID is missing");
    }
    if (!tableNo) {
      return rejectWithValue("Table No is missing");
    }

    const res = await axios.put(
      `${backendURL}/api/v1/cart/update`,
      { items, customerID, tableNo },
      { withCredentials: true }
    );

    const convertedData = res.data.map((item: CartItem) => ({
      ...item,
      MaxRate: Number(item.MaxRate),
      Amount: Number(item.Amount),
    }));

    return convertedData;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data);
    } else {
      return rejectWithValue("An unknown error while updating Cart");
    }
  }
});

export const updateQtyAndSync = createAsyncThunk<
  CartItem[],
  { ItemCode: string; Qty: number },
  { rejectValue: string; state: RootState }
>(
  "cart/updateQtyAndSync",
  async ({ ItemCode, Qty }, { getState, rejectWithValue }) => {
    try {
      const { customer, cart, table } = getState();
      const customerID = customer.CustomerID;
      const tableNo = table.currentTable;

      console.log("Item", ItemCode);

      if (!customerID) {
        return rejectWithValue("Customer ID is missing");
      }
      if (!tableNo) {
        return rejectWithValue("Table No is missing");
      }

      const item = cart.cart.find(
        (cartItem) => cartItem.ItemCode === ItemCode.toString()
      );

      if (!item) {
        return rejectWithValue("Item not found in cart");
      }

      const updatedItem = {
        ...item,
        Qty,
        Amount: Qty * Number(item.MaxRate), // Recalculate the amount
      };

      console.log("updated", updatedItem);

      // Update in the database
      const res = await axios.put(
        `${backendURL}/api/v1/cart/update`,
        { items: updatedItem, customerID, tableNo },
        { withCredentials: true }
      );

      const convertedData = res.data.map((item: CartItem) => ({
        ...item,
        MaxRate: Number(item.MaxRate),
        Amount: Number(item.Amount),
      }));

      return convertedData;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue(
          "An unknown error occurred while updating the cart"
        );
      }
    }
  }
);

export const getCartSync = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string; state: RootState }
>("cart/syncCart", async (_, { rejectWithValue, getState }) => {
  try {
    const { customer, table } = getState();
    const customerID = customer.CustomerID;
    const tableNo = table.currentTable;

    const syncedCart = await axios.post(
      `${backendURL}/api/v1/cart/sync`,
      { customerID, tableNo },
      {
        withCredentials: true,
      }
    );

    const convertedData = syncedCart.data.map((item: CartItem) => ({
      ...item,
      MaxRate: Number(item.MaxRate),
      Amount: Number(item.Amount),
    }));

    return convertedData;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data);
    } else {
      return rejectWithValue("An unknown error while syncing Cart");
    }
  }
});

export const deleteCartItem = createAsyncThunk<
  DeleteCartResponse,
  { ItemCode: string; CustomerID: string; tableNo: string },
  { rejectValue: string }
>(
  "cart/deleteItem",
  async ({ ItemCode, CustomerID, tableNo }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${backendURL}/api/v1/cart/delete`, {
        data: { ItemCode, CustomerID, tableNo },
        withCredentials: true,
      });
      return data as DeleteCartResponse;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Failed to delete item from cart");
    }
  }
);
