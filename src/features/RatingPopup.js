import { createSlice } from "@reduxjs/toolkit";

const initialUserStateValue = false;

export const ratingPopupSlice = createSlice({
  name: "RatingPopup",
  initialState: { value: initialUserStateValue },
  reducers: {
    openRatingPopup: (state, action) => {
      state.value = action.payload;
    },
    closeRatingPopup: (state) => {
      state.value = initialUserStateValue;
    },
  },
});

export const { openRatingPopup, closeRatingPopup } = ratingPopupSlice.actions;
export default ratingPopupSlice.reducer;
