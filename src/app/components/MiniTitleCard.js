import "../../css/MiniTitleCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import { useDispatch } from "react-redux";
import { openRemoveWatchlistPopup } from "@/features/RemoveWatchlistPopup";
import useAddToWatchlist from "@/Custom Hooks/useAddToWatchlist";
import { useEffect, useState } from "react";

export default function MiniTitleCard({ title }) {
  const posterUrl = title.poster_path
    ? `https://image.tmdb.org/t/p/w500${title.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  const { watchlist } = useFetchWatchlist();
  const dispatch = useDispatch();
  const watchlistItem = watchlist.find((item) => item.id === title.id);

  const handleRemoveFromListClick = (event, itemId) => {
    event.preventDefault();
    dispatch(openRemoveWatchlistPopup(itemId));
  };

  const { handleAddToWatchlist } = useAddToWatchlist(title.id);
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const [cast, setCast] = useState([]);
  useEffect(() => {
    // Function to fetch movie data

    async function fetchMovieCast() {
      try {
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${title.id}/credits?api_key=${apiKey}`
        );
        const castData = await castResponse.json();
        setCast(castData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovieCast();
  }, [title.id]);
  return (
    <div className="mini-title-card-container">
      <img src={posterUrl} alt="" />
      <div className="card-components">
        {watchlistItem ? (
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
            onClick={(e) => {
              handleAddToWatchlist(title, "movie", cast.cast.slice(0, 2));
              e.preventDefault();
            }}
            className="popular-movies-button global-button"
          >
            Add to Watch List
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
        )}
      </div>
    </div>
  );
}
