import React, { useEffect, useState } from "react";
import "../../css/PopularMoviesCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCircleInfo,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const PopularMoviesCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  const [cast, setCast] = useState([]);
  useEffect(() => {
    // Function to fetch movie data

    async function fetchMovieCast() {
      try {
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`
        );
        const castData = await castResponse.json();
        setCast(castData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovieCast();
  }, [movie.id]);
  const { addToWatchlist } = useFetchWatchlist();
  return (
    <div className="populuar-movies-card-container">
      <img src={posterUrl} alt="" />
      <div className="card-components">
        <div className="rating">
          <FontAwesomeIcon icon={faStar} />
          <p>{movie.vote_average.toFixed(1)}</p>
          <Link href={"/"}> Rate it</Link>
        </div>
        <h2>{movie.title}</h2>
        <p className="movie-plot">
          {movie.overview.length > 0 ? movie.overview : `No Plot Available`}
          {movie.overview}
        </p>
        <Link
          href={{
            pathname: `/title/${movie.id}`,
            query: { type: "movie" },
          }}
          className="popular-movies-button global-button"
        >
          Show More Info
          <FontAwesomeIcon icon={faCircleInfo} />
        </Link>
        <button
          onClick={() => addToWatchlist(movie, "movie", cast.cast.slice(0, 2))}
          className="popular-movies-button global-button"
        >
          Add to Watch List
          <FontAwesomeIcon icon={faSquarePlus} />
        </button>
      </div>
    </div>
  );
};

export default PopularMoviesCard;
