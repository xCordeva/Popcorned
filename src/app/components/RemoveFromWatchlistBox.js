import "@/css/RemoveFromWatchlistBox.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { closeRemoveWatchlistPopup } from "@/features/RemoveWatchlistPopup";

export default function RemoveFromWatchlistBox() {
  const dispatch = useDispatch();
  return (
    <div className="remove-watchlist-box-contianer">
      <div className="remove-watchlist-box">
        <h2>Are you sure you want to remove this ?</h2>
        <div className="buttons">
          <button>Yes</button>
          <button>No</button>
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
