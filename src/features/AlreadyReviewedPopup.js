import { createSlice } from "@reduxjs/toolkit";

const initialUserStateValue = false;

export const alreadyReviewedSlice = createSlice({
  name: "AlreadyReviewed",
  initialState: { value: initialUserStateValue },
  reducers: {
    openAlreadyReviewedPopup: (state, action) => {
      state.value = action.payload;
    },
    closeAlreadyReviewedPopup: (state) => {
      state.value = initialUserStateValue;
    },
  },
});

export const { openAlreadyReviewedPopup, closeAlreadyReviewedPopup } =
  alreadyReviewedSlice.actions;
export default alreadyReviewedSlice.reducer;
