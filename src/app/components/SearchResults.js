import React from "react";
import "../../css/SearchResults.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const SearchResults = ({ movies, status }) => {
  if (status === "loading") {
    return (
      <div
        className="search-results loading-search-results"
        style={{ height: movies.length > 1 ? "440px" : "220px" }}
      >
        {movies.length > 1 ? (
          <>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
              alt="Loading..."
            />
            <p>Loading...</p>
          </>
        ) : (
          <>
            <p>We couldn't find any results.</p>
          </>
        )}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="search-results">
        Sorry we're having trouble searching.
      </div>
    );
  }
  console.log(movies);
  return (
    <div
      className="search-results"
      style={{ height: movies.length > 1 ? "440px" : "220px" }}
    >
      {movies.slice(0, 10).map((movie) => (
        <div className="search-result" key={movie.id}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title + ` Poster`}
          />
          <div className="result-details">
            <h2>{movie.title}</h2>
            <div className="date-rating">
              <p>{movie.release_date}</p>
              <p>
                <FontAwesomeIcon icon={faStar} />
                {movie.vote_average.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
