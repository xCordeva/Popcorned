import React from "react";
import "../../css/PopularMoviesCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCircleInfo,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const PopularMoviesCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
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
        <Link href={"/movie-details"}>
          Show More Info
          <FontAwesomeIcon icon={faCircleInfo} />
        </Link>
        <Link href={"/"}>
          Add to Watch List
          <FontAwesomeIcon icon={faSquarePlus} />
        </Link>
      </div>
    </div>
  );
};

export default PopularMoviesCard;
