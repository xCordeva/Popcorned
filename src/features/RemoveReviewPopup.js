import { createSlice } from "@reduxjs/toolkit";

const initialUserStateValue = null;

export const removeReviewPopupSlice = createSlice({
  name: "RemoveReviewPopup",
  initialState: { value: initialUserStateValue },
  reducers: {
    openRemoveReviewPopup: (state, action) => {
      state.value = action.payload;
    },
    closeRemoveReviewPopup: (state) => {
      state.value = initialUserStateValue;
    },
  },
});

export const { openRemoveReviewPopup, closeRemoveReviewPopup } =
  removeReviewPopupSlice.actions;
export default removeReviewPopupSlice.reducer;
