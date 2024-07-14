"use client";

import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/css/Career.css";
import Career from "@/app/components/Career";
import RemoveFromWatchlistBox from "@/app/components/RemoveFromWatchlistBox";
import { useSelector } from "react-redux";
import SignInMessage from "@/app/components/SignInMessage";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";

const api_key = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// func to fetch the total number of a show's episodes to be compared later with the actors number of episodes he appeared in
const fetchTvShowDetails = async (showId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}?api_key=${api_key}`
  );
  const data = await response.json();
  return data.number_of_episodes;
};

// func to fetch the top cast for a given movie or TV show
const fetchCast = async (mediaType, id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${api_key}`
  );
  const data = await response.json();
  return data.cast; // Get the top 2 cast members
};

export default function allCast({ params }) {
  usePopupCloser();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const id = params.id;

  const [loading, setLoading] = useState(true);

  const [works, setWorks] = useState([]);
  const [personDetails, setPersonDetails] = useState([]);

  useEffect(() => {
    const fetchAllWorks = async () => {
      try {
        const personDetailsResponse = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${api_key}`
        );

        const personDetailsData = await personDetailsResponse.json();
        setPersonDetails(personDetailsData);

        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${api_key}`
        );
        const data = await response.json();

        let tvShowsAsCast = data.cast.filter(
          (role) => role.media_type === "tv" && role.episode_count
        );
        let tvShowsAsCrew = data.crew.filter(
          (role) => role.media_type === "tv" && role.episode_count
        );

        // Combine TV shows as cast and crew
        let tvShows = [...tvShowsAsCast, ...tvShowsAsCrew];

        let moviesAsCast = data.cast.filter(
          (role) => role.media_type === "movie"
        );
        let moviesAsCrew = data.crew.filter(
          (role) => role.media_type === "movie"
        );

        // Combine movies as cast and crew
        let movies = [...moviesAsCast, ...moviesAsCrew];

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

        // fetching top cast for movies
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

        tvShowsWithDetails.forEach(addToCombinedResults);
        moviesWithDetails.forEach(addToCombinedResults);

        setWorks(combinedResults);
      } catch (error) {
        console.error("Error fetching known for data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWorks();
  }, [id]);

  const showPopup = useSelector((state) => state.RemoveWatchlistPopup.value);
  const showSignInMessagePopup = useSelector(
    (state) => state.SignInMessagePopup.value
  );
  if (loading)
    return (
      <div className="page-loading">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
          alt="loading-gif"
        />
        <p>Loading...</p>
      </div>
    );

  if (!works)
    return (
      <div className="page-not-found">
        <h1>404 Not Found!</h1>
        <p>Oops we couldn't find anything with that title...</p>
      </div>
    );

  return (
    <div>
      <Navbar></Navbar>
      <div className="career-page">
        <Career
          id={id}
          type={type}
          works={works}
          personDetails={personDetails}
        ></Career>
      </div>
      {showPopup && <RemoveFromWatchlistBox></RemoveFromWatchlistBox>}
      {showSignInMessagePopup && <SignInMessage></SignInMessage>}
    </div>
  );
}
