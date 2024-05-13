"use client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import UserPopupReducer from "./UserPopup";

const store = configureStore({
  reducer: {
    UserPopup: UserPopupReducer,
  },
});

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
