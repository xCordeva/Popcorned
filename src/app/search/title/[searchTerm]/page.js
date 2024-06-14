"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import "@/css/SearchPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faStar,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { userSearchInput, fetchAll } from "@/features/UserSearch";

const SearchPage = ({ params }) => {
  const dispatch = useDispatch();

  const searchInput = decodeURIComponent(params.searchTerm);

  const SearchResults = useSelector(
    (state) => state.UserSearch.combinedResults
  );
  const userSearch = useSelector((state) => state.UserSearch.searchInput);
  const [loading, setLoading] = useState(true);
  const status = useSelector((state) => state.UserSearch.status);

  useEffect(() => {
    dispatch(userSearchInput(searchInput));
    dispatch(fetchAll(searchInput));
    setLoading(false);
  }, [searchInput, userSearch, dispatch]);

  if (!searchInput && !userSearch) {
    return (
      <div>
        <Navbar />
        <div className="no-valid-search">
          <h1>This is not a valid search</h1>
          <Link href={`/`}>Back to Homepage</Link>
        </div>
      </div>
    );
  }

  if (loading || status === "loading") {
    return (
      <div className="search-page-loading">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
          alt="loading-gif"
        />
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="search-page">
        <h1>Showing results for {userSearch}</h1>
        {SearchResults < 1 ? (
          <div className="no-results">
            <h1>We couldn't find any results related to that search</h1>
            <Link href={`/`}>Back to Homepage</Link>
          </div>
        ) : (
          SearchResults.map((result) => (
            <div className="search-result" key={result.id}>
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
              <div className="result-type">
                <p>
                  {result.type === "movie"
                    ? "Movie"
                    : result.type === "tv"
                    ? "TV Show"
                    : result.type === "person"
                    ? "Person"
                    : "Unknown"}
                </p>
              </div>

              <div className="result-details">
                <div className="title-rate">
                  <h1>{result.title ? result.title : result.name}</h1>
                  <div className="rating">
                    {result.vote_average !== 0 && result.vote_average && (
                      <p>
                        <FontAwesomeIcon icon={faStar} />
                        {result.vote_average.toFixed(1)}
                        <span>/10</span>
                      </p>
                    )}
                  </div>
                </div>
                {result.topCast && result.type !== "person" ? (
                  <div className="top-cast">
                    {result.topCast.map((castMember, index) => (
                      <div key={castMember.id}>
                        <Link
                          href={{
                            pathname: `/title/${castMember.id}`,
                            query: { type: "person" },
                          }}
                        >
                          {castMember.name}
                        </Link>
                        {index < result.topCast.length - 1 && <p>, </p>}
                      </div>
                    ))}
                  </div>
                ) : null}
                {result.type === "person" && (
                  <p className="known-for">
                    Known for {result.known_for_department}
                  </p>
                )}
                {(result.release_date || result.first_air_date) && (
                  <h3>
                    {result.release_date
                      ? result.release_date.split("-")[0]
                      : result.first_air_date.split("-")[0]}
                  </h3>
                )}
                <div className="info-watchlist">
                  <Link
                    href={{
                      pathname: `/title/${result.id}`,
                      query: { type: result.type },
                    }}
                    className="more-info global-button"
                  >
                    Show More Info
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </Link>
                  {result.type !== "person" ? (
                    <Link href={"/"} className="add-watchlist global-button">
                      Add to Watch List
                      <FontAwesomeIcon icon={faSquarePlus} />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
