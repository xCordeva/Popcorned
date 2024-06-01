import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  movies: [],
  tvShows: [],
  people: [],
  status: "idle",
  error: null,
};

const api_key = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const fetchAll = createAsyncThunk(
  "userSearch/fetchAll",
  async (query) => {
    const [moviesResponse, tvShowsResponse, peopleResponse] = await Promise.all(
      [
        fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}`
        ),
        fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${query}`
        ),
        fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${query}`
        ),
      ]
    );

    if (!moviesResponse.ok || !tvShowsResponse.ok || !peopleResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const moviesData = await moviesResponse.json();
    const tvShowsData = await tvShowsResponse.json();
    const peopleData = await peopleResponse.json();
    console.log("Movies:", moviesData.results);
    console.log("TV Shows:", tvShowsData.results);
    console.log("People:", peopleData.results);
    return {
      movies: moviesData.results,
      tvShows: tvShowsData.results,
      people: peopleData.results,
    };
  }
);

export const userSearchSlice = createSlice({
  name: "UserSearch",
  initialState,
  reducers: {
    userSearchInput: (state, action) => {
      state.value = action.payload;
    },
    closeSearchPopup: (state) => {
      state.value = "";
    },
    resetSearchResults: (state) => {
      state.movies = [];
      state.tvShows = [];
      state.people = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload.movies;
        state.tvShows = action.payload.tvShows;
        state.people = action.payload.people;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { userSearchInput, closeSearchPopup, resetSearchResults } =
  userSearchSlice.actions;
export default userSearchSlice.reducer;
