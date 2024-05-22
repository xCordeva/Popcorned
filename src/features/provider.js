"use client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import UserPopupReducer from "./UserPopup";
import UserSearchReducer from "./UserSearch";

const store = configureStore({
  reducer: {
    UserPopup: UserPopupReducer,
    UserSearch: UserSearchReducer,
  },
});

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
