import { useEffect, useState } from "react";
import "../../css/TitlesCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCircleInfo,
  faSquarePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import { useDispatch } from "react-redux";
import { openRemoveWatchlistPopup } from "@/features/RemoveWatchlistPopup";
import useAddToWatchlist from "@/Custom Hooks/useAddToWatchlist";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const TitlesCard = ({ title, type }) => {
  const posterUrl = title.poster_path
    ? `https://image.tmdb.org/t/p/w500${title.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  const [cast, setCast] = useState([]);
  useEffect(() => {
    // Function to fetch title data

    async function fetchTitleCast() {
      try {
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/${type}/${title.id}/credits?api_key=${apiKey}`
        );
        const castData = await castResponse.json();
        setCast(castData);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    }
    fetchTitleCast();
  }, [title.id]);
  const { watchlist, isLoading } = useFetchWatchlist();
  const dispatch = useDispatch();
  const watchlistItem = watchlist.find((item) => item.id === title.id);

  const handleRemoveFromListClick = (event, itemId) => {
    event.preventDefault();
    dispatch(openRemoveWatchlistPopup(itemId));
  };

  const { handleAddToWatchlist } = useAddToWatchlist(title.id);
  if (watchlist && isLoading) {
    return (
      <div className="secondary-loading">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/loading.gif?alt=media&token=fb93d855-3412-4e08-bf85-a696cc68004a"
          alt="loading-gif"
        />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="movies-card-container">
      <img src={posterUrl} alt="" />
      <div className="card-components">
        <div className="rating">
          <FontAwesomeIcon icon={faStar} />
          <p>{title.vote_average.toFixed(1)}</p>
          <Link href={"/"}> Rate it</Link>
        </div>
        <h2>{title.title || title.name}</h2>
        <p className="movie-plot">
          {title.overview.length > 0 ? title.overview : `No Plot Available`}
          {title.overview}
        </p>
        <Link
          href={{
            pathname: `/title/${title.id}`,
            query: { type },
          }}
          className="popular-movies-button global-button"
        >
          Show More Info
          <FontAwesomeIcon icon={faCircleInfo} />
        </Link>
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
            onClick={() =>
              handleAddToWatchlist(title, type, cast.cast.slice(0, 2))
            }
            className="popular-movies-button global-button"
          >
            Add to Watch List
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TitlesCard;
