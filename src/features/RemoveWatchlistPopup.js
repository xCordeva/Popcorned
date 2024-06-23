import { createSlice } from "@reduxjs/toolkit";

const initialUserStateValue = false;

export const removeWatchListPopupSlice = createSlice({
  name: "RemoveWatchlistPopup",
  initialState: { value: initialUserStateValue },
  reducers: {
    openRemoveWatchlistPopup: (state, action) => {
      state.value = action.payload;
    },
    closeRemoveWatchlistPopup: (state) => {
      state.value = initialUserStateValue;
    },
  },
});

export const { openRemoveWatchlistPopup, closeRemoveWatchlistPopup } =
  removeWatchListPopupSlice.actions;
export default removeWatchListPopupSlice.reducer;
