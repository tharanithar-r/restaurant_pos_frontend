import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import searchReducer from "./searchSlice";
import authReducer from "./auth/authSlice";
import customerReducer from "../redux/customers/customerSlice";
import cartReducer from "../redux/cart/cartSlice";
import orderReducer from "../redux/orders/orderSlice";
import tableReducer from "../redux/table/tableSlice";
import kitchenReducer from "../redux/kitchen/kitchenSlice";
import menuReducer from "../redux/menu/menuSlice";
import { AnyAction } from "redux";

const store = configureStore({
  reducer: {
    customer: customerReducer,
    menu: menuReducer,
    cart: cartReducer,
    order: orderReducer,
    auth: authReducer,
    table: tableReducer,
    kitchen: kitchenReducer,
    search: searchReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
export default store;
