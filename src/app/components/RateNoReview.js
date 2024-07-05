import "@/css/RateNoReview.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeRateNoReviewPopup } from "@/features/RateNoReviewPopup";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { triggerRefetch } from "@/features/RefetchReviews";

const RateNoReview = ({ rate, id, type }) => {
  const [leaveReviewClicked, setLeaveReviewClicked] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const dispatch = useDispatch();

  const { addNewReview } = useFetchReviews();
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);

  const submitRateNoReview = () => {
    const timestamp = Math.floor(Date.now() / 1000); // adding the timestamp manually since using the firebase server timestamp does not show immediately
    addNewReview({
      reviewDetails: reviewText,
      rating: rate,
      titleId: id,
      titleType: type,
      createdAt: { seconds: timestamp },
    });
    dispatch(closeRateNoReviewPopup(false));
  };
  const submitRateWithReview = () => {
    const timestamp = Math.floor(Date.now() / 1000); // adding the timestamp manually since using the firebase server timestamp does not show immediately
    addNewReview({
      reviewDetails: reviewText,
      rating: rate,
      titleId: id,
      titleType: type,
      createdAt: { seconds: timestamp },
    }).then(() => {
      dispatch(triggerRefetch(!refetchReviews));
    });
    setReviewText("");
    dispatch(closeRateNoReviewPopup(false));
  };

  return (
    <div className="rate-no-review-contianer">
      <div className="rate-no-review-box">
        <h2>Do you want to submit a rating without a review?</h2>

        <div
          className={`buttons ${leaveReviewClicked ? `hide-buttons` : null} `}
        >
          <button onClick={() => submitRateNoReview()}>Yes</button>
          <button onClick={() => setLeaveReviewClicked(true)}>
            Leave a Review
          </button>
        </div>
        <div
          className={`rating-review ${
            leaveReviewClicked ? `show-rating-review` : null
          } `}
        >
          <textarea
            type="text"
            placeholder="Write your review here..."
            onChange={(event) => setReviewText(event.target.value)}
            value={reviewText}
          />

          <button
            className="rating-button"
            onClick={() => submitRateWithReview()}
          >
            Submit Review
          </button>
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
