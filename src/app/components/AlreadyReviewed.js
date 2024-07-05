import "@/css/AlreadyReviewed.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { closeAlreadyReviewedPopup } from "@/features/AlreadyReviewedPopup";
import Review from "./Review";

const AlreadyReviewed = ({ review }) => {
  const dispatch = useDispatch();

  const [editReviewClicked, setEditReviewClicked] = useState(false);

  return (
    <div className="already-reviewed-contianer">
      <div className="already-reviewed-box">
        <h2>Looks like you have already reviewed this title</h2>
        <div className="rating-review">
          <Review review={review} editReview={editReviewClicked}></Review>
          <div className="buttons">
            <button onClick={() => dispatch(closeAlreadyReviewedPopup(false))}>
              Dismiss
            </button>
            <button onClick={() => setEditReviewClicked(true)}>
              {editReviewClicked ? `Submit Review` : `Edit Review`}
            </button>
          </div>
          <FontAwesomeIcon
            icon={faXmark}
            className="x-mark"
            onClick={() => {
              setEditReviewClicked(false);
              dispatch(closeAlreadyReviewedPopup(false));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AlreadyReviewed;
