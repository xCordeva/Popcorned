import "@/css/RemoveFromWatchlistBox.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { closeRemoveWatchlistPopup } from "@/features/RemoveWatchlistPopup";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import { triggerRefetch } from "@/features/RefetchWatchlist";

export default function RemoveFromWatchlistBox() {
  const titleId = useSelector((state) => state.RemoveWatchlistPopup.value);

  const dispatch = useDispatch();
  const { removeFromWatchlist } = useFetchWatchlist();
  const refetchWatchlist = useSelector((state) => state.RefetchWatchlist.value);
  const handleRemoveFromWatchlist = () => {
    removeFromWatchlist(titleId);
    dispatch(triggerRefetch(!refetchWatchlist));
    dispatch(closeRemoveWatchlistPopup(false));
  };
  return (
    <div className="remove-watchlist-box-contianer">
      <div className="remove-watchlist-box">
        <h2>Are you sure you want to remove this ?</h2>
        <div className="buttons">
          <button onClick={handleRemoveFromWatchlist}>Yes</button>
          <button onClick={() => dispatch(closeRemoveWatchlistPopup(null))}>
            No
          </button>
        </div>
        <FontAwesomeIcon
          icon={faXmark}
          className="x-mark"
          onClick={() => dispatch(closeRemoveWatchlistPopup(false))}
        />
      </div>
    </div>
  );
}
