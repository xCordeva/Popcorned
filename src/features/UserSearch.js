import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  movies: [],
  tvShows: [],
  people: [],
  combinedResults: [],
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

    const exactMatchMovies = moviesData.results.filter(
      (movie) => movie.title.toLowerCase() === query.toLowerCase()
    );
    const exactMatchTvShows = tvShowsData.results.filter(
      (tvShow) => tvShow.name.toLowerCase() === query.toLowerCase()
    );
    const exactMatchPeople = peopleData.results.filter(
      (person) => person.name.toLowerCase() === query.toLowerCase()
    );

    const sortedMovies = exactMatchMovies.concat(
      moviesData.results
        .filter((movie) => !exactMatchMovies.includes(movie))
        .sort((a, b) => b.popularity - a.popularity)
    );
    const sortedTvShows = exactMatchTvShows.concat(
      tvShowsData.results
        .filter((tvShow) => !exactMatchTvShows.includes(tvShow))
        .sort((a, b) => b.popularity - a.popularity)
    );
    const sortedPeople = exactMatchPeople.concat(
      peopleData.results
        .filter((person) => !exactMatchPeople.includes(person))
        .sort((a, b) => b.popularity - a.popularity)
    );

    return {
      movies: sortedMovies,
      tvShows: sortedTvShows,
      people: sortedPeople,
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
      state.combinedResults = [];
    },
    combinedSearchResults: (state) => {
      state.combinedResults = [
        ...state.movies.map((item) => ({ ...item, type: "movie" })),
        ...state.tvShows.map((item) => ({ ...item, type: "tv" })),
        ...state.people.map((item) => ({ ...item, type: "person" })),
      ];
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
        state.combinedResults = [
          ...action.payload.movies.map((item) => ({ ...item, type: "movie" })),
          ...action.payload.tvShows.map((item) => ({ ...item, type: "tv" })),
          ...action.payload.people.map((item) => ({ ...item, type: "person" })),
        ];
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
