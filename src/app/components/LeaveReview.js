import "@/css/LeaveReview.css";
import { faStar, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { useDispatch, useSelector } from "react-redux";
import { triggerRefetch } from "@/features/RefetchReviews";
import RateNoReview from "./RateNoReview";
import { openRateNoReviewPopup } from "@/features/RateNoReviewPopup";
import GiveRatingPopupMessage from "./GiveRatingPopupMessage";
import useAuth from "@/Custom Hooks/useAuth";

export default function LeaveReview({ id, type }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [clickedStar, setClickedStar] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [showGiveRatingPopup, setShowGiveRatingPopup] = useState(false);
  const [showEmptyFieldsMessage, setShowEmptyFieldsMessage] = useState(false);

  const { user } = useAuth();

  const isRateNoReviewOpen = useSelector(
    (state) => state.RateNoReviewPopup.value
  );
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);

  const handleMouseEnter = (index) => {
    setHoveredStar(index);
  };

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  const handleRateClick = (index) => {
    setClickedStar(index);
  };

  const { addNewReview, isLoading, reviews } = useFetchReviews();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (clickedStar > 0 && !reviewText) {
      dispatch(openRateNoReviewPopup(true));
    } else if (clickedStar > 0 && reviewText) {
      const timestamp = Math.floor(Date.now() / 1000); // adding the timestamp manually since using the firebase server timestamp does not show immediately
      addNewReview({
        rating: clickedStar,
        reviewDetails: reviewText,
        titleId: id,
        titleType: type,
        createdAt: { seconds: timestamp },
      }).then(() => {
        dispatch(triggerRefetch(!refetchReviews));
      });
      setClickedStar(0);
      setReviewText("");
    } else if (reviewText && clickedStar === 0) {
      setShowGiveRatingPopup(true);
      setTimeout(() => {
        setShowGiveRatingPopup(false);
      }, 2000);
    } else {
      setShowEmptyFieldsMessage(true);
      setTimeout(() => {
        setShowEmptyFieldsMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="leave-review">
      <h1>Leave a Review</h1>
      <div className="review-details">
        <h2>Give a Rating</h2>
        <div
          className={`rating-stars  ${showEmptyFieldsMessage ? `shaking` : ``}`}
        >
          {[...Array(10)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < (hoveredStar || clickedStar) ? faStar : faStarReg}
              onMouseEnter={() => handleMouseEnter(index + 1)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRateClick(index + 1)}
            />
          ))}
        </div>
        <p className="rating">
          <FontAwesomeIcon icon={faStar} />
          <span>{hoveredStar || clickedStar}</span>/10
        </p>
        <textarea
          className={`${showEmptyFieldsMessage ? `textarea-empty` : ``}`}
          type="text"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
        />
        <p
          className={`field-cant-be-empty ${
            showEmptyFieldsMessage ? `show` : ``
          }`}
        >
          <FontAwesomeIcon icon={faCircleExclamation} /> This field can not be
          empty
        </p>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Submit Review
        </button>
      </div>
      {isRateNoReviewOpen && <RateNoReview></RateNoReview>}
      {showGiveRatingPopup && <GiveRatingPopupMessage></GiveRatingPopupMessage>}
    </div>
  );
}
