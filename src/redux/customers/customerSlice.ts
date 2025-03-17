import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface CustomerState {
  CustomerID: string | null;
  CustomerName: string | null;
}

const initialState: CustomerState = {
  CustomerID: "",
  CustomerName: "",
};

interface SetCustomerPayload {
  CustomerID: string;
  CustomerName: string;
}

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer(state, action: PayloadAction<SetCustomerPayload | null>) {
      if (action.payload) {
        const { CustomerID, CustomerName } = action.payload;
        state.CustomerID = CustomerID;
        state.CustomerName = CustomerName;
      }
    },
  },
});

export const { setCustomer } = customerSlice.actions;
export default customerSlice.reducer;

export const getCurrentCustomer = (state: RootState) => {
  return state.customer.CustomerID;
};
