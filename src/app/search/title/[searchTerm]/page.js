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
import { useSearchParams } from "next/navigation";

const SearchPage = ({ params }) => {
  const dispatch = useDispatch();

  const searchInput = params.searchTerm;

  const SearchResults = useSelector(
    (state) => state.UserSearch.combinedResults
  );
  const userSearch = useSelector((state) => state.UserSearch.searchInput);

  useEffect(() => {
    dispatch(userSearchInput(searchInput));
    dispatch(fetchAll(searchInput));
  }, [searchInput, userSearch, dispatch]);
  const searchParams = useSearchParams();
  // const type = searchParams.get("type");

  const id = params.id;

  useEffect(() => {
    const fetchCastDetails = async (id, type) => {
      try {
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const castData = await castResponse.json();
        return castData.cast.slice(0, 2);
      } catch (error) {
        console.error("Error fetching cast details:", error);
        return [];
      }
    };
    //     SearchResults.forEach((result) => {
    //       result
    //     });
    //     SearchResults.forEach((result) => {
    //       result
    //     });
    // i want to add the top cast members to every result to
    // const loadCasts = async () => {
    //   const newCasts = {};
    //   for (const result of SearchResults) {
    //     const mediaType = result.title ? "movie" : "tv";
    //     newCasts[result.id] = await fetchCastDetails(result.id, mediaType);
    //   }
    //   setCasts(newCasts);
    // };

    // if (SearchResults.length > 0) {
    //   loadCasts();
    // }
  }, [SearchResults]);
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
  console.log(SearchResults);
  return (
    <div>
      <Navbar />
      <div className="search-page">
        <h1>Showing results for {userSearch}</h1>
        {SearchResults.map((result) => (
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
            <div className="result-details">
              <div className="title-rate">
                <h1>{result.title ? result.title : result.name}</h1>
                <div className="rating">
                  {result.vote_average && (
                    <p>
                      <FontAwesomeIcon icon={faStar} />
                      {result.vote_average.toFixed(1)}
                      <span>/10</span>
                    </p>
                  )}
                </div>
              </div>
              {(result.release_date || result.first_air_date) && (
                <h2>
                  {result.release_date
                    ? result.release_date.split("-")[0]
                    : result.first_air_date.split("-")[0]}
                </h2>
              )}
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
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
