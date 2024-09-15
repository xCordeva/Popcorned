import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  searchInput: "",
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

    // Add type to each item
    const moviesWithType = await Promise.all(
      moviesData.results.map(async (item) => {
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${item.id}/credits?api_key=${api_key}`
        );
        const castData = await castResponse.json();
        return {
          ...item,
          type: "movie",
          topCast: castData.cast.slice(0, 2),
        };
      })
    );

    const tvShowsWithType = await Promise.all(
      tvShowsData.results.map(async (item) => {
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${item.id}/credits?api_key=${api_key}`
        );
        const castData = await castResponse.json();
        return {
          ...item,
          type: "tv",
          topCast: castData.cast.slice(0, 2),
        };
      })
    );

    const peopleWithType = peopleData.results.map((item) => ({
      ...item,
      type: "person",
    }));

    // Find exact matches
    const exactMatchMovies = moviesWithType.filter(
      (movie) => movie.title.toLowerCase() === query.toLowerCase()
    );
    const exactMatchTvShows = tvShowsWithType.filter(
      (tvShow) => tvShow.name.toLowerCase() === query.toLowerCase()
    );
    const exactMatchPeople = peopleWithType.filter(
      (person) => person.name.toLowerCase() === query.toLowerCase()
    );

    // Get the highest popularity exact match
    const mostPopularExactMatch = [
      ...exactMatchMovies,
      ...exactMatchTvShows,
      ...exactMatchPeople,
    ].sort((a, b) => b.popularity - a.popularity)[0];

    // Combine and sort results
    const sortedMovies = moviesWithType
      .filter((movie) => movie !== mostPopularExactMatch)
      .sort((a, b) => b.popularity - a.popularity);
    const sortedTvShows = tvShowsWithType
      .filter((tvShow) => tvShow !== mostPopularExactMatch)
      .sort((a, b) => b.popularity - a.popularity);
    const sortedPeople = peopleWithType
      .filter((person) => person !== mostPopularExactMatch)
      .sort((a, b) => b.popularity - a.popularity);

    let combinedResults = [...sortedMovies, ...sortedTvShows, ...sortedPeople];

    // sorting the results to show the most popular at top of the list
    combinedResults = combinedResults.sort(
      (a, b) => b.popularity - a.popularity
    );

    // Add the most popular exact match at the beginning if exists
    if (mostPopularExactMatch) {
      combinedResults = [mostPopularExactMatch, ...combinedResults];
    }

    return {
      searchInput: query,
      movies: sortedMovies,
      tvShows: sortedTvShows,
      people: sortedPeople,
      combinedResults,
    };
  }
);

export const userSearchSlice = createSlice({
  name: "UserSearch",
  initialState,
  reducers: {
    userSearchInput: (state, action) => {
      state.value = action.payload;
      state.searchInput = action.payload;
    },
    resetSearchResults: (state) => {
      state.movies = [];
      state.tvShows = [];
      state.people = [];
      state.combinedResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchInput = action.payload.searchInput;
        state.movies = action.payload.movies;
        state.tvShows = action.payload.tvShows;
        state.people = action.payload.people;
        state.combinedResults = action.payload.combinedResults;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { userSearchInput, resetSearchResults } = userSearchSlice.actions;

export default userSearchSlice.reducer;
