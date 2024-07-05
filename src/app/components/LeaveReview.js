import "@/css/LeaveReview.css";
import {
  faStar,
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { useDispatch, useSelector } from "react-redux";
import { triggerRefetch } from "@/features/RefetchReviews";
import { openRateNoReviewPopup } from "@/features/RateNoReviewPopup";
import { openAlreadyReviewedPopup } from "@/features/AlreadyReviewedPopup";
import RateNoReview from "./RateNoReview";
import GiveRatingPopupMessage from "./GiveRatingPopupMessage";
import useAuth from "@/Custom Hooks/useAuth";
import AlreadyReviewed from "./AlreadyReviewed";

export default function LeaveReview({ id, type }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [clickedStar, setClickedStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showGiveRatingPopup, setShowGiveRatingPopup] = useState(false);
  const [shakingRedStars, setShakingRedStars] = useState(false);
  const [showEmptyFieldsMessage, setShowEmptyFieldsMessage] = useState(false);
  const [starsChanged, setStarsChanged] = useState(false);
  const [rateUpdated, setRateUpdated] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hideLeaveReviewSection, setHideLeaveReviewSection] = useState(false);

  const { user } = useAuth();
  const dispatch = useDispatch();

  const isRateNoReviewOpen = useSelector(
    (state) => state.RateNoReviewPopup.value
  );
  const isAlreadyReviewedOpen = useSelector(
    (state) => state.AlreadyReviewedPopup.value
  );
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);

  const { addNewReview, isLoading, reviews, editReview } = useFetchReviews();

  const userAlreadyReviewed = reviews.find(
    (review) =>
      review.titleId === id &&
      review.titleType === type &&
      review.userId === user.uid
  );

  useEffect(() => {
    if (userAlreadyReviewed) {
      setClickedStar(userAlreadyReviewed.rating);
    }
  }, [userAlreadyReviewed]);

  const handleMouseEnter = (index) => setHoveredStar(index);
  const handleMouseLeave = () => setHoveredStar(0);
  const handleRateClick = (index) => {
    setClickedStar(index);
    if (userAlreadyReviewed) {
      setStarsChanged(true);
    }
  };

  const handleSubmit = () => {
    if (
      userAlreadyReviewed &&
      userAlreadyReviewed.reviewDetails !== "" &&
      clickedStar > 0 &&
      reviewText
    ) {
      dispatch(openAlreadyReviewedPopup(true));
    } else if (userAlreadyReviewed && clickedStar > 0 && !reviewText) {
      setShowEmptyFieldsMessage(true);
      setTimeout(() => setShowEmptyFieldsMessage(false), 3000);
    } else if (
      userAlreadyReviewed &&
      userAlreadyReviewed.reviewDetails === "" &&
      clickedStar > 0 &&
      reviewText
    ) {
      editReview(
        {
          ...userAlreadyReviewed,
          rating: clickedStar,
          reviewDetails: reviewText,
        },
        userAlreadyReviewed.firebaseItemId
      ).then(() => {
        setReviewSubmitted(true);
        setTimeout(() => {
          setHideLeaveReviewSection(true);
        }, 2000);
        setTimeout(() => {
          dispatch(triggerRefetch(!refetchReviews));
        }, 2500);
      });
      setClickedStar(0);
    } else if (clickedStar > 0 && !reviewText) {
      dispatch(openRateNoReviewPopup(true));
    } else if (clickedStar > 0 && reviewText) {
      const timestamp = Math.floor(Date.now() / 1000);
      addNewReview({
        rating: clickedStar,
        reviewDetails: reviewText,
        titleId: id,
        titleType: type,
        createdAt: { seconds: timestamp },
      }).then(() => {
        setReviewSubmitted(true);
        setTimeout(() => {
          setHideLeaveReviewSection(true);
        }, 2000);
        setTimeout(() => {
          dispatch(triggerRefetch(!refetchReviews));
        }, 2500);
      });
      setClickedStar(0);
    } else if (reviewText && clickedStar === 0) {
      setShowGiveRatingPopup(true);
      setTimeout(() => setShowGiveRatingPopup(false), 2000);
    } else {
      setShowEmptyFieldsMessage(true);
      setShakingRedStars(true);
      setTimeout(() => {
        setShowEmptyFieldsMessage(false);
        setShakingRedStars(false);
      }, 2500);
    }
  };

  const updateRating = () => {
    setStarsChanged(false);
    if (userAlreadyReviewed) {
      editReview(
        { ...userAlreadyReviewed, rating: clickedStar },
        userAlreadyReviewed.firebaseItemId
      ).then(() => {
        setRateUpdated(true);
        setTimeout(() => setRateUpdated(false), 2000);
        dispatch(triggerRefetch(!refetchReviews));
      });
    }
  };

  return (
    <div
      className={`leave-review ${
        hideLeaveReviewSection ? `hide-leave-review` : ``
      }`}
    >
      <div
        className={`leave-review-content-contianer ${
          reviewSubmitted ? `hide-leave-review-content-contianer` : ``
        }`}
      >
        <h1>Leave a Review</h1>
        <div className="review-details">
          <h2>
            {userAlreadyReviewed
              ? "You have already rated this title"
              : "Give a Rating"}
          </h2>
          <div className={`rating-stars ${shakingRedStars ? "shaking" : ""}`}>
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
          <button
            className={`rate-button ${starsChanged ? "show-rate-button" : ""}`}
            onClick={updateRating}
          >
            <FontAwesomeIcon icon={faStarReg} />
            Update Rating
          </button>
          <p
            className={`${rateUpdated ? "show-rate-updated" : "rate-updated"}`}
          >
            Updated
            <FontAwesomeIcon icon={faCircleCheck} />
          </p>
          <p className="rating">
            <FontAwesomeIcon icon={faStar} />
            <span>{hoveredStar || clickedStar}</span>/10
          </p>
          <textarea
            className={`${showEmptyFieldsMessage ? "textarea-empty" : ""}`}
            type="text"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
          />
          <p
            className={`field-cant-be-empty ${
              showEmptyFieldsMessage ? "show" : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircleExclamation} /> This field cannot be
            empty
          </p>
          <button className="submit-button" onClick={handleSubmit}>
            Submit Review
          </button>
        </div>
        {!userAlreadyReviewed && isRateNoReviewOpen && (
          <RateNoReview id={id} type={type} rate={clickedStar} />
        )}
        {showGiveRatingPopup && <GiveRatingPopupMessage />}
        {isAlreadyReviewedOpen && (
          <AlreadyReviewed review={userAlreadyReviewed} />
        )}
      </div>
      <div
        id="leave-review-box-rate-submitted"
        className={`hide-rate-submitted ${
          reviewSubmitted ? `rate-submitted` : ``
        }`}
      >
        <FontAwesomeIcon icon={faCircleCheck} />
        <h1>
          Your {reviewText === "" ? `rate` : `review`} has been submitted!
        </h1>
      </div>
    </div>
  );
}
