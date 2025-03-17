/* eslint-disable @typescript-eslint/no-explicit-any */
//import { Dispatch, Action } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuth, setAuthError, setAuthLoading } from "./authSlice";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signIn =
  (username: string, password: string, role: "kitchen" | "waiter") =>
  async (dispatch: any) => {
    dispatch(setAuthLoading());
    try {
      const apiRole = role === "kitchen" ? "user" : role;
      const res = await api.post(`${backendURL}/api/v1/${apiRole}/signin`, {
        username,
        password,
      });

      if (res.status === 200) {
        dispatch(setAuth({ id: username, role }));
        return true;
      } else {
        dispatch(setAuthError("Invalid credentials"));
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || `Error during ${role} sign-in`;
      dispatch(setAuthError(errorMessage));
      return false;
    }
  };

export const signOut = () => async (dispatch: any) => {
  dispatch(setAuthLoading());
  try {
    await api.get(`${backendURL}/api/v1/signout`);
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || `Error during sign-out`;
    dispatch(setAuthError(errorMessage));
    return false;
  }
};
