import { createSlice } from "@reduxjs/toolkit";

const initialUserStateValue = false;

export const signInMessagePopupSlice = createSlice({
  name: "SignInMessagePopup",
  initialState: { value: initialUserStateValue },
  reducers: {
    showSignInMessagePopup: (state, action) => {
      state.value = action.payload;
    },
    closeSignInMessagePopup: (state) => {
      state.value = initialUserStateValue;
    },
  },
});

export const { showSignInMessagePopup, closeSignInMessagePopup } =
  signInMessagePopupSlice.actions;
export default signInMessagePopupSlice.reducer;
