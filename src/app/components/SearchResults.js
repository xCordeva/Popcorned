import React from "react";
import "../../css/SearchResults.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { resetSearchResults, userSearchInput } from "@/features/UserSearch";

const SearchResults = ({
  status,
  searchButtonClicked,
  userSearch,
  setUserSearch,
  searchIconClicked,
  setSearchIconClicked,
}) => {
  const combinedResults = useSelector(
    (state) => state.UserSearch.combinedResults
  );
  const currentPathname = usePathname();
  const dispatch = useDispatch();
  const handleResultClick = (result) => {
    const resultPath = `/title/${result.id}`;
    if (currentPathname === resultPath) {
      // Reset search and close the popup
      setUserSearch("");
      dispatch(userSearchInput(""));
      dispatch(resetSearchResults());
      if (window.innerWidth < 700 && searchIconClicked) {
        setSearchIconClicked(false);
      }
    }
  };
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
        <div className="no-results">Sorry we're having trouble searching.</div>
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
          <p>Sorry, we couldn't find any titles with that name.</p>
        </div>
      ) : (
        <>
          {combinedResults.slice(0, 10).map((result) => (
            <div key={result.id}>
              <Link
                href={{
                  pathname: `/title/${result.id}`,
                  query: { type: result.type },
                }}
                onClick={() => handleResultClick(result)}
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
                    {result.topCast && result.type !== "person" ? (
                      <div className="top-cast">
                        {result.topCast.map((castMember, index) => (
                          <div key={castMember.id}>
                            <p
                              href={{
                                pathname: `/title/${castMember.id}`,
                                query: { type: "person" },
                              }}
                            >
                              {castMember.name}
                            </p>
                            {index < result.topCast.length - 1 && (
                              <p>,&nbsp;</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
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
                    {result.type === "person" && (
                      <p className="search-known-for">
                        Known for {result.known_for_department}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {combinedResults.length > 10 && (
            <Link
              className="show-all-results"
              onClick={searchButtonClicked}
              href={`/search/title/${userSearch}`}
            >
              Show all results
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
