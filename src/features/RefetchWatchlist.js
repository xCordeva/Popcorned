import { createSlice } from "@reduxjs/toolkit";

const initialRefetchWatchlistStateValue = false;
export const refetchWatchlistSlice = createSlice({
  name: "RefetchWatchlist",
  initialState: { value: initialRefetchWatchlistStateValue },
  reducers: {
    triggerRefetch: (state, action) => {
      state.value = action.payload;
    },
    refetchWatchlistState: (state) => {
      state.value = initialRefetchWatchlistStateValue;
    },
  },
});

export const { triggerRefetch, refetchEventsState } =
  refetchWatchlistSlice.actions;
export default refetchWatchlistSlice.reducer;
