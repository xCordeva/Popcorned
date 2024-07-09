"use client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import UserPopupReducer from "./UserPopup";
import UserSearchReducer from "./UserSearch";
import RatingPopupReducer from "./RatingPopup";
import RemoveWatchlistPopupReducer from "./RemoveWatchlistPopup";
import RefetchWatchlistReducer from "./RefetchWatchlist";
import RefetchReviewsReducer from "./RefetchReviews";
import RateNoReviewPopupReducer from "./RateNoReviewPopup";
import AlreadyReviewedPopupReducer from "./AlreadyReviewedPopup";
import SignInMessagePopupReducer from "./SignInMessagePopup";

const store = configureStore({
  reducer: {
    UserPopup: UserPopupReducer,
    UserSearch: UserSearchReducer,
    RatingPopup: RatingPopupReducer,
    RateNoReviewPopup: RateNoReviewPopupReducer,
    AlreadyReviewedPopup: AlreadyReviewedPopupReducer,
    SignInMessagePopup: SignInMessagePopupReducer,
    RemoveWatchlistPopup: RemoveWatchlistPopupReducer,
    RefetchWatchlist: RefetchWatchlistReducer,
    RefetchReviews: RefetchReviewsReducer,
  },
});

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
