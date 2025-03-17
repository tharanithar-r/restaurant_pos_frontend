import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  id: string;
  role: "kitchen" | "waiter" | "";
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  id: "",
  role: "",
  status: "idle",
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      if (action.payload) {
        state.id = action.payload.id;
        state.role = action.payload.role;
        state.status = "succeeded";
        state.error = null;
      }
    },
    clearAuth(state) {
      state.id = "";
      state.role = "";
      state.status = "idle";
      state.error = null;
    },
    setAuthLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    setAuthError(state, action) {
      state.status = "failed";
      state.error = action.payload;
      state.id = "";
      state.role = "";
    },
  },
});

export const { setAuth, clearAuth, setAuthLoading, setAuthError } =
  authSlice.actions;
export default authSlice.reducer;

export const selectCurrentAuth = (state: RootState) => state.auth;
