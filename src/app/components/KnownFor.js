import { useEffect, useState } from "react";
import Link from "next/link";
import PersonsWork from "./PersonsWork";
import "@/css/KnownFor.css";
import { useSelector } from "react-redux";
import RemoveFromWatchlistBox from "./RemoveFromWatchlistBox";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";

const api_key = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// func to fetch the total number of a show's episodes to be compared later with the actors number of episodes he appeared in
const fetchTvShowDetails = async (showId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}?api_key=${api_key}`
  );
  const data = await response.json();
  return data.number_of_episodes;
};

// Function to fetch cast members of a media
const fetchCast = async (mediaType, mediaId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${api_key}`
  );
  const data = await response.json();
  return data.cast;
};

const KnownFor = ({ id, details }) => {
  const [knownFor, setKnownFor] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoading } = useFetchWatchlist();
  const showPopup = useSelector((state) => state.RemoveWatchlistPopup.value);

  useEffect(() => {
    const fetchKnownFor = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${api_key}`
        );
        const data = await response.json();

        let tvShows = [];
        let movies = [];
        // a check to see if the person is an actor or not
        if (details.known_for_department === "Acting") {
          tvShows = data.cast.filter(
            (role) => role.media_type === "tv" && role.episode_count
          );
          movies = data.cast.filter((role) => role.media_type === "movie");
        } else {
          tvShows = data.crew.filter(
            (role) => role.media_type === "tv" && role.episode_count
          );
          movies = data.crew.filter((role) => role.media_type === "movie");
        }

        // fetching episode count for TV shows
        const tvShowsWithDetails = await Promise.all(
          tvShows.map(async (show) => {
            const totalEpisodes = await fetchTvShowDetails(show.id);
            const cast = await fetchCast("tv", show.id);
            return {
              ...show,
              totalEpisodes,
              cast,
              appearancePercentage: (show.episode_count / totalEpisodes) * 100,
            };
          })
        );

        // Fetch additional details for movies
        const moviesWithDetails = await Promise.all(
          movies.map(async (movie) => {
            const cast = await fetchCast("movie", movie.id);
            return {
              ...movie,
              cast,
            };
          })
        );
        // sorting TV shows by appearance percentage and popularity
        tvShowsWithDetails.sort((a, b) => {
          if (b.appearancePercentage !== a.appearancePercentage) {
            return b.appearancePercentage - a.appearancePercentage;
          }
          return b.popularity - a.popularity;
        });

        // sorting movies by order and popularity
        moviesWithDetails.sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return b.popularity - a.popularity;
        });

        // making sure no duplicates are added
        const knownForSet = new Set();
        const combinedResults = [];

        const addToCombinedResults = (item) => {
          if (!knownForSet.has(item.id)) {
            knownForSet.add(item.id);
            combinedResults.push(item);
          }
        };

        // getting top 2 TV shows and top 2 movies and filling remaining slots if necessary
        const topTvShows = tvShowsWithDetails.slice(0, 2);
        const topMovies = moviesWithDetails.slice(0, 2);

        topTvShows.forEach(addToCombinedResults);
        topMovies.forEach(addToCombinedResults);

        // if there are remaining slots filling with more TV shows or movies if less than 4 items
        let remainingTvShows = tvShowsWithDetails.slice(2);
        let remainingMovies = movies.slice(2);

        while (
          combinedResults.length < 4 &&
          (remainingTvShows.length > 0 || remainingMovies.length > 0)
        ) {
          if (remainingTvShows.length > 0) {
            addToCombinedResults(remainingTvShows.shift());
          }
          if (combinedResults.length < 4 && remainingMovies.length > 0) {
            addToCombinedResults(remainingMovies.shift());
          }
        }

        setKnownFor(combinedResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching known for data:", error);
        setLoading(false);
      }
    };

    fetchKnownFor();
  }, [id, details]);

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="known-for">
        <h1>Known For</h1>
        <div className="secondary-loading">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/loading.gif?alt=media&token=fb93d855-3412-4e08-bf85-a696cc68004a"
            alt="loading-gif"
          />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="known-for">
      <h1>Known For</h1>
      <div className="the-known-works">
        {knownFor.map((work) => (
          <PersonsWork work={work} key={work.id}></PersonsWork>
        ))}

        <Link
          className="show-all"
          href={{
            pathname: `/title/${id}/career`,
            query: { type: "person" },
          }}
        >
          Show all the work
        </Link>
      </div>
      {showPopup && <RemoveFromWatchlistBox></RemoveFromWatchlistBox>}
    </div>
  );
};

export default KnownFor;
