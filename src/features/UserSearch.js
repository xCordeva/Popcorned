import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  movies: [],
  status: "idle",
  error: null,
  // initialSearchPopup: false,
};
const api_key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export const fetchMovies = createAsyncThunk(
  "userSearch/fetchMovies",
  async (query) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  }
);
export const userSearchSlice = createSlice({
  name: "UserSearch",
  initialState,
  reducers: {
    userSearchInput: (state, action) => {
      state.value = action.payload;
    },
    closeSearchPopup: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { userSearchInput, closeSearchPopup } = userSearchSlice.actions;
export default userSearchSlice.reducer;
