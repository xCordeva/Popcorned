import "@/css/RateNoReview.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { closeRateNoReviewPopup } from "@/features/RateNoReviewPopup";

const RateNoReview = () => {
  const [leaveReviewClicked, setLeaveReviewClicked] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className="rate-no-review-contianer">
      <div className="rate-no-review-box">
        <h2>Do you want to submit a rating without a review?</h2>

        <div
          className={`buttons ${leaveReviewClicked ? `hide-buttons` : null} `}
        >
          <button>Yes</button>
          <button onClick={() => setLeaveReviewClicked(true)}>
            Leave a Review
          </button>
        </div>
        <div
          className={`rating-review ${
            leaveReviewClicked ? `show-rating-review` : null
          } `}
        >
          <textarea type="text" placeholder="Write your review here..." />

          <button className="rating-button">Submit Review</button>
          <FontAwesomeIcon
            icon={faXmark}
            className="x-mark"
            onClick={() => dispatch(closeRateNoReviewPopup(false))}
          />
        </div>
      </div>
    </div>
  );
};

export default RateNoReview;
