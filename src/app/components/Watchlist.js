import RemoveFromWatchListBox from "./RemoveFromWatchlistBox";
import Link from "next/link";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { openRemoveWatchlistPopup } from "@/features/RemoveWatchlistPopup";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";

export default function Watchlist() {
  const dispatch = useDispatch();
  const showPopup = useSelector((state) => state.RemoveWatchlistPopup.value);
  const handleRemoveFromListClick = (event, itemId) => {
    event.preventDefault();
    dispatch(openRemoveWatchlistPopup(itemId));
  };
  const { watchlist, isLoading } = useFetchWatchlist();
  if (watchlist < 1 && !isLoading) {
    return (
      <div className="watchlist-section">
        <h1>Your Watchlist</h1>
        <div className="watchlist-not-found">
          <h1>Nothing here yet!</h1>
          <Link href={`/#popular-movies`}>
            Start adding your favorite titles now!
          </Link>
        </div>
      </div>
    );
  }
  console.log(watchlist);
  return (
    <div className="watchlist-section">
      <h1>Your Watchlist</h1>
      <div className="watchlist-items">
        {watchlist.map((item) => (
          <Link
            href={{
              pathname: `/title/${item.id}`,
              query: { type: item.media_type || item.type },
            }}
            className="watchlist-item"
            key={item.id}
          >
            <img
              src={
                item.poster_path || item.profile_path
                  ? item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : `https://image.tmdb.org/t/p/w500${item.profile_path}`
                  : "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
              }
              alt={item.title + ` Poster`}
            />
            <div className="item-type">
              <p>
                {item.type === "movie"
                  ? "Movie"
                  : item.type === "tv"
                  ? "TV Show"
                  : "Unknown"}
              </p>
            </div>

            <div className="item-details">
              <div className="title-rate">
                <h1>{item.title ? item.title : item.name}</h1>
                <div className="rating">
                  {item.vote_average !== 0 && item.vote_average && (
                    <p>
                      <FontAwesomeIcon icon={faStar} />
                      {item.vote_average.toFixed(1)}
                      <span>/10</span>
                    </p>
                  )}
                </div>
              </div>
              {item.topCast && item.type !== "person" ? (
                <div className="top-cast">
                  {item.topCast.map((castMember, index) => (
                    <div key={castMember.id}>
                      <Link
                        href={{
                          pathname: `/title/${castMember.id}`,
                          query: { type: "person" },
                        }}
                      >
                        {castMember.name}
                      </Link>
                      {index < item.topCast.length - 1 && <p>, </p>}
                    </div>
                  ))}
                </div>
              ) : null}

              {(item.release_date || item.first_air_date) && (
                <h3>
                  {item.release_date
                    ? item.release_date.split("-")[0]
                    : item.first_air_date.split("-")[0]}
                </h3>
              )}

              <button
                className="remove-item global-button"
                onClick={(event) =>
                  handleRemoveFromListClick(event, item.firebaseItemId)
                }
              >
                Remove from watchlist
              </button>
            </div>
          </Link>
        ))}
        <div className="watchlist-item"></div>
      </div>
      {showPopup && <RemoveFromWatchListBox></RemoveFromWatchListBox>}
    </div>
  );
}
