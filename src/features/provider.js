"use client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import UserPopupReducer from "./UserPopup";
import UserSearchReducer from "./UserSearch";
import RatingPopupReducer from "./RatingPopup";
import RemoveWatchlistPopupReducer from "./RemoveWatchlistPopup";

const store = configureStore({
  reducer: {
    UserPopup: UserPopupReducer,
    UserSearch: UserSearchReducer,
    RatingPopup: RatingPopupReducer,
    RemoveWatchlistPopup: RemoveWatchlistPopupReducer,
  },
});

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
