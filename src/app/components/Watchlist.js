import React from "react";
import PersonsWork from "./PersonsWork";
import RemoveFromWatchListBox from "./RemoveFromWatchlistBox";
import Link from "next/link";
import {
  faSquarePlus,
  faStar,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  closeRemoveWatchlistPopup,
  openRemoveWatchlistPopup,
} from "@/features/RemoveWatchlistPopup";

export default function Watchlist() {
  const knownFor = [
    {
      adult: false,
      backdrop_path: "/70Rm9ItxKuEKN8iu6rNjfwAYUCJ.jpg",
      genre_ids: [27, 53, 9648],
      id: 760104,
      original_language: "en",
      original_title: "X",
      overview:
        "In 1979, a group of young filmmakers set out to make an adult film in rural Texas, but when their reclusive, elderly hosts catch them in the act, the cast find themselves fighting for their lives.",
      popularity: 324.704,
      poster_path: "/A7YPhQKdcr6XB1kCUdS4tHifYWd.jpg",
      release_date: "2022-03-17",
      title: "X",
      video: false,
      vote_average: 6.731,
      vote_count: 2849,
      character: "Maxine / Pearl",
      credit_id: "5fa05f86f04d010036a6224b",
      order: 0,
      media_type: "movie",
    },
    {
      adult: false,
      backdrop_path: "/dapb1b0mQtGcxP4PYzNCjuN7gOr.jpg",
      genre_ids: [80, 27, 53],
      id: 1023922,
      original_language: "en",
      original_title: "MaXXXine",
      overview:
        "In 1980s Hollywood, adult film star and aspiring actress Maxine Minx finally gets her big break. But as a mysterious killer stalks the starlets of Hollywood, a trail of blood threatens to reveal her sinister past.",
      popularity: 64.686,
      poster_path: "/49MhUSsD9hG36nFttYRzgedMlL0.jpg",
      release_date: "2024-07-04",
      title: "MaXXXine",
      video: false,
      vote_average: 0,
      vote_count: 0,
      character: "Maxine Minx",
      credit_id: "632026e50bb076007b7a047b",
      order: 0,
      media_type: "movie",
    },
    {
      adult: false,
      backdrop_path: "/8rmx3Wh6fQdSL2nzTmdFn9thcK8.jpg",
      genre_ids: [27, 18],
      id: 949423,
      original_language: "en",
      original_title: "Pearl",
      overview:
        "Trapped on her family’s isolated farm, Pearl must tend to her ailing father under the bitter and overbearing watch of her devout mother. Lusting for a glamorous life like she’s seen in the movies, Pearl’s ambitions, temptations, and repressions collide.",
      popularity: 59.016,
      poster_path: "/ulBLIBqvdnf4H6JBt0OpMCU1ECn.jpg",
      release_date: "2022-09-16",
      title: "Pearl",
      video: false,
      vote_average: 7.295,
      vote_count: 1471,
      character: "Pearl",
      credit_id: "622f3f1ba6fdaa00732bd6dc",
      order: 0,
      media_type: "movie",
    },
    {
      adult: false,
      backdrop_path: "/9SQ0ZLBAcv23D9xJ1nlgTWqDNc5.jpg",
      genre_ids: [16, 18, 35, 27, 14],
      id: 926899,
      original_language: "en",
      original_title: "The House",
      overview:
        "Across different eras, a poor family, an anxious developer and a fed-up landlady become tied to the same mysterious house in this animated dark comedy.",
      popularity: 32.745,
      poster_path: "/iZjMFSKCrleKolC1gYcz5Rs8bk1.jpg",
      release_date: "2022-01-14",
      title: "The House",
      video: false,
      vote_average: 7.022,
      vote_count: 983,
      character: "Mabel (voice)",
      credit_id: "61e18e42c175b200665619e7",
      order: 0,
      media_type: "movie",
    },
  ];
  const removePopup = useSelector((state) => state.RemoveWatchlistPopup.value);
  const dispatch = useDispatch();
  const handleRemoveFromListClick = (event) => {
    event.preventDefault();
    dispatch(openRemoveWatchlistPopup(true));
  };
  return (
    <div className="watchlist-section">
      <h1>Your Watchlist</h1>
      <div className="watchlist-items">
        {knownFor.map((result) => (
          <Link
            href={{
              pathname: `/title/${result.id}`,
              query: { type: result.media_type },
            }}
            className="watchlist-item"
            key={result.id}
          >
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
            <div className="item-type">
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

            <div className="item-details">
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

              {(result.release_date || result.first_air_date) && (
                <h3>
                  {result.release_date
                    ? result.release_date.split("-")[0]
                    : result.first_air_date.split("-")[0]}
                </h3>
              )}

              <button
                className="remove-item global-button"
                onClick={handleRemoveFromListClick}
              >
                Remove from watchlist
              </button>
            </div>
          </Link>
        ))}
        <div className="watchlist-item"></div>
      </div>
      {removePopup && <RemoveFromWatchListBox></RemoveFromWatchListBox>}
    </div>
  );
}
