import { createSlice } from "@reduxjs/toolkit";

const initialUserStateValue = false;

export const rateNoReviewSlice = createSlice({
  name: "RateNoReview",
  initialState: { value: initialUserStateValue },
  reducers: {
    openRateNoReviewPopup: (state, action) => {
      state.value = action.payload;
    },
    closeRateNoReviewPopup: (state) => {
      state.value = initialUserStateValue;
    },
  },
});

export const { openRateNoReviewPopup, closeRateNoReviewPopup } =
  rateNoReviewSlice.actions;
export default rateNoReviewSlice.reducer;
