import Link from "next/link";
import {
  faSquarePlus,
  faStar,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/css/PersonsWork.css";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import { useDispatch, useSelector } from "react-redux";
import { triggerRefetch } from "@/features/RefetchWatchlist";
import { openRemoveWatchlistPopup } from "@/features/RemoveWatchlistPopup";

export default function PersonsWork({ work }) {
  const dispatch = useDispatch();
  const { addToWatchlist, watchlist, isLoading } = useFetchWatchlist();

  const watchlistItem = watchlist.find((item) => item.id === work.id);

  const handleRemoveFromListClick = (event, itemId) => {
    event.preventDefault();
    dispatch(openRemoveWatchlistPopup(itemId));
  };
  const refetchWatchlist = useSelector((state) => state.RefetchWatchlist.value);

  const handleAddToWatchlist = (event, result, type, topCast) => {
    event.preventDefault();
    dispatch(triggerRefetch(!refetchWatchlist));
    addToWatchlist(result, type, topCast);
  };

  return (
    <Link
      href={`/title/${work.id}?type=${work.media_type}`}
      className="the-work"
    >
      <img
        src={
          work.poster_path
            ? `https://image.tmdb.org/t/p/w500${work.poster_path}`
            : "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
        }
        alt={work.title + ` Poster`}
      />
      <div className="work-type">
        <p>
          {work.media_type === "movie"
            ? "Movie"
            : work.media_type === "tv"
            ? "TV Show"
            : "Unknown"}
        </p>
      </div>

      <div className="work-details">
        <div className="title-rate">
          <h1>{work.title ? work.title : work.name}</h1>
          <div className="rating">
            {work.vote_average !== 0 && work.vote_average && (
              <p>
                <FontAwesomeIcon icon={faStar} />
                {work.vote_average.toFixed(1)}
                <span>/10</span>
              </p>
            )}
          </div>
        </div>
        <h3 className="character-name">
          {work.character ? work.character : work.job}
        </h3>
        {(work.release_date || work.first_air_date) && (
          <h3>
            {work.release_date
              ? work.release_date.split("-")[0]
              : work.first_air_date.split("-")[0]}
          </h3>
        )}

        {work.type !== "person" &&
          (watchlistItem ? (
            <button
              onClick={(event) =>
                handleRemoveFromListClick(event, watchlistItem.firebaseItemId)
              }
              className="remove-item global-button"
            >
              Remove from watchlist
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          ) : (
            <button
              onClick={(event) =>
                handleAddToWatchlist(
                  event,
                  work,
                  "movie",
                  work.cast.slice(0, 2)
                )
              }
              className="add-to-watchlist global-button"
            >
              Add to Watch List
              <FontAwesomeIcon icon={faSquarePlus} />
            </button>
          ))}
      </div>
    </Link>
  );
}
