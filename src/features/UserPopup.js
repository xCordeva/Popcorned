import { createSlice } from "@reduxjs/toolkit";

const initialUserStateValue = false;

export const userPopupSlice = createSlice({
  name: "userPopup",
  initialState: { value: initialUserStateValue },
  reducers: {
    openUserPopup: (state, action) => {
      state.value = action.payload;
    },
    closeUserPopup: (state) => {
      state.value = initialUserStateValue;
    },
  },
});

export const { openUserPopup, closeUserPopup } = userPopupSlice.actions;
export default userPopupSlice.reducer;
