import "@/css/RateNoReview.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeRateNoReviewPopup } from "@/features/RateNoReviewPopup";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { triggerRefetch } from "@/features/RefetchReviews";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

const RateNoReview = ({ rate, id, type, details, cast }) => {
  const [leaveReviewClicked, setLeaveReviewClicked] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const dispatch = useDispatch();

  const { addNewReview } = useFetchReviews();
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);
  const [rateSubmitted, setRateSubmitted] = useState(false);

  const submitReview = () => {
    const timestamp = Math.floor(Date.now() / 1000);

    addNewReview({
      details,
      topCast: cast.cast.slice(0, 2),
      reviewDetails: reviewText,
      rating: rate,
      titleId: id,
      titleType: type,
      createdAt: { seconds: timestamp },
    }).then(() => {
      setRateSubmitted(true);

      setTimeout(() => {
        dispatch(triggerRefetch(!refetchReviews));
        setRateSubmitted(false);
        setReviewText("");
        dispatch(closeRateNoReviewPopup(false));
      }, 2000);
    });
  };

  return (
    <div className="rate-no-review-contianer">
      <div className="rate-no-review-box">
        <div
          className={`rate-no-review-content-container ${
            rateSubmitted ? `hide-rate-no-review-content-container` : ``
          }`}
        >
          <h2>Do you want to submit a rating without a review?</h2>
          <div
            className={`buttons ${leaveReviewClicked ? `hide-buttons` : null} `}
          >
            <button onClick={() => submitReview()}>Yes</button>
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

            <button className="rating-button" onClick={() => submitReview()}>
              Submit Review
            </button>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faXmark}
          className="x-mark"
          onClick={() => dispatch(closeRateNoReviewPopup(false))}
        />

        <div
          className={`${
            rateSubmitted ? `rate-submitted` : `hide-rate-submitted`
          }`}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          <h1>
            Your {reviewText === "" ? `rate` : `review`} has been submitted!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default RateNoReview;
