import { createSlice } from "@reduxjs/toolkit";

const initialRefetchReviewsStateValue = false;
export const refetchReviewsSlice = createSlice({
  name: "RefetchReviews",
  initialState: { value: initialRefetchReviewsStateValue },
  reducers: {
    triggerRefetch: (state, action) => {
      state.value = action.payload;
    },
    refetchReviewsState: (state) => {
      state.value = initialRefetchReviewsStateValue;
    },
  },
});

export const { triggerRefetch, refetchReviewsState } =
  refetchReviewsSlice.actions;
export default refetchReviewsSlice.reducer;
