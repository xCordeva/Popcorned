import React from "react";
import "../../css/SearchResults.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSelector } from "react-redux";

const SearchResults = ({ status }) => {
  const combinedResults = useSelector(
    (state) => state.UserSearch.combinedResults
  );
  if (status === "loading") {
    return (
      <div
        className="search-results loading-search-results"
        style={{ height: combinedResults.length > 1 ? "440px" : "220px" }}
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
          alt="Loading..."
        />
        <p>Loading...</p>
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

  return (
    <div
      className="search-results"
      style={{ height: combinedResults.length > 1 ? "440px" : "220px" }}
    >
      {combinedResults.length < 1 ? (
        <div className="no-results">
          <p>Sorry, we couldn't find any movies with that name.</p>
        </div>
      ) : (
        combinedResults.slice(0, 10).map((result) => (
          <Link
            href={{
              pathname: `/title/${result.id}`,
              query: { type: result.type },
            }}
            key={result.id}
          >
            <div className="search-result">
              <img
                src={
                  result.poster_path || result.profile_path
                    ? result.poster_path
                      ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
                      : `https://image.tmdb.org/t/p/w500${result.profile_path}`
                    : "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
                }
                alt={result.title + ` Poster`}
              />

              <div className="result-details">
                <h2>{result.title ? result.title : result.name}</h2>
                <div className="date-rating">
                  {(result.release_date || result.first_air_date) && (
                    <p>
                      {result.release_date
                        ? result.release_date.split("-")[0]
                        : result.first_air_date.split("-")[0]}
                    </p>
                  )}
                  {result.vote_average && (
                    <p>
                      <FontAwesomeIcon icon={faStar} />
                      {result.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default SearchResults;
