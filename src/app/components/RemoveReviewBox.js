import "@/css/RemoveFromWatchlistBox.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { triggerRefetch } from "@/features/RefetchReviews";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { closeRemoveReviewPopup } from "@/features/RemoveReviewPopup";

export default function RemoveFromWatchlistBox({ setClickedStar }) {
  const reviewId = useSelector((state) => state.RemoveReviewPopup.value);

  const dispatch = useDispatch();
  const { removeReview } = useFetchReviews();
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);
  const handleRemoveReview = () => {
    removeReview(reviewId).then(() => {
      dispatch(triggerRefetch(!refetchReviews));
      dispatch(closeRemoveReviewPopup());
      {
        setClickedStar && setClickedStar(0);
      }
    });
  };
  return (
    <div className="remove-watchlist-box-contianer">
      <div className="remove-watchlist-box">
        <h2>Are you sure you want to remove this review?</h2>
        <div className="buttons">
          <button onClick={handleRemoveReview}>Yes</button>
          <button onClick={() => dispatch(closeRemoveReviewPopup(null))}>
            No
          </button>
        </div>
        <FontAwesomeIcon
          icon={faXmark}
          className="x-mark"
          onClick={() => {
            dispatch(closeRemoveReviewPopup(null));
          }}
        />
      </div>
    </div>
  );
}
