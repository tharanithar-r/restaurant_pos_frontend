import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { OrderItem } from "./orderSlice";
import { CartItem } from "../cart/cartSlice";
import { RootState } from "../store";
import { setTableList } from "../table/tableSlice";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const createOrder = createAsyncThunk<
  string,
  { items: CartItem[] },
  { rejectValue: string; state: RootState }
>(
  "orders/createOrder",
  async (orderData, { dispatch, getState, rejectWithValue }) => {
    try {
      const { customer, table, auth } = getState();
      const customerID = customer.CustomerID;
      const tableNo = table.currentTable;
      const guestCount = table.currentGuestCount;
      const waiter = auth.id;

      const itemsWithSno = orderData.items.map((item, index) => ({
        ...item,
        Sno: index + 1,
      }));

      const res = await axios.post(
        `${backendURL}/api/v1/order/new`,
        {
          orderData: { ...orderData, items: itemsWithSno },
          customerID,
          tableNo,
          waiter,
          guestCount,
        },
        {
          withCredentials: true,
        }
      );
      // Update table list with new data
      if (res.data.tables) {
        dispatch(setTableList(res.data.tables));
      }

      return res.data.message;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue(
          "An unknown error occurred while creating the order"
        );
      }
    }
  }
);

export const getOrdersSync = createAsyncThunk<
  OrderItem[],
  void,
  { rejectValue: string; state: RootState }
>("orders/syncOrders", async (_, { rejectWithValue, getState }) => {
  try {
    const { table } = getState();
    const tableNo = table.currentTable;
    const syncedOrders = await axios.get(
      `${backendURL}/api/v1/order/ordersbyId`,
      {
        params: { tableNo },
        withCredentials: true,
      }
    );

    return syncedOrders.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data);
    } else {
      return rejectWithValue("An unknown error while syncing Orders");
    }
  }
});

export const billOrder = createAsyncThunk<
  string,
  void,
  { rejectValue: string; state: RootState }
>("orders/billOrder", async (_, { rejectWithValue, getState }) => {
  try {
    const { table, auth, order } = getState();
    const tableNo = table.currentTable;
    const orders = order.orders;
    const waiter = auth.id;
    const res = await axios.post(
      `${backendURL}/api/v1/order/bill`,
      { orders, tableNo, waiter },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return rejectWithValue(err.response.data);
    } else {
      return rejectWithValue(
        "An unknown error occurred while confirming the order"
      );
    }
  }
});

export const serveItem = createAsyncThunk<
  string,
  { orderNo: string; sNo: number; ItemCode: string },
  { rejectValue: string; state: RootState }
>(
  "orders/serveItem",
  async (
    data: { orderNo: string; sNo: number; ItemCode: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const { table } = getState();
      const tableNo = table.currentTable;
      const response = await axios.post(
        `${backendURL}/api/v1/kitchen/changeItemStatus`,
        { ...data, tableNo: tableNo, status: "Served" },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Failed to serve item");
    }
  }
);

export const deleteItem = createAsyncThunk<
  string,
  { orderNo: string; sno: number },
  { rejectValue: string }
>(
  "orders/serveItem",
  async (data: { orderNo: string; sno: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/v1/order/delete`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Failed to delete item");
    }
  }
);
