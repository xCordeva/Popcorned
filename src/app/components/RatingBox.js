import "@/css/RatingBox.css";
import { faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarReg,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeRatingPopup } from "@/features/RatingPopup";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import useAuth from "@/Custom Hooks/useAuth";
import { triggerRefetch } from "@/features/RefetchReviews";

const RatingBox = ({ type, id }) => {
  const dispatch = useDispatch();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [clickedStar, setClickedStar] = useState(0);
  const { addNewReview, reviews, isLoading, editReview } = useFetchReviews();

  const handleMouseEnter = (index) => {
    setHoveredStar(index);
  };
  const { user } = useAuth();

  const userAlreadyReviewed = reviews.find(
    (review) =>
      review.titleId == id &&
      review.titleType === type &&
      (user ? review.userId === user.uid : false)
  );

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  const handleRateClick = (index) => {
    setClickedStar(index);
  };
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);
  useEffect(() => {
    if (userAlreadyReviewed) {
      setClickedStar(userAlreadyReviewed.rating);
    }
  }, [userAlreadyReviewed]);

  const submitReview = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    if (userAlreadyReviewed) {
      editReview(
        {
          ...userAlreadyReviewed,
          rating: clickedStar,
        },
        userAlreadyReviewed.firebaseItemId
      ).then(() => {
        setRateSubmitted(true);

        setTimeout(() => {
          dispatch(triggerRefetch(!refetchReviews));
          setRateSubmitted(false);
          dispatch(closeRatingPopup(true));
        }, 2000);
      });
    } else {
      addNewReview({
        rating: clickedStar,
        reviewDetails: "",
        titleId: id,
        titleType: type,
        createdAt: { seconds: timestamp },
      }).then(() => {
        setRateSubmitted(true);

        setTimeout(() => {
          dispatch(triggerRefetch(!refetchReviews));
          setRateSubmitted(false);
          dispatch(closeRatingPopup(true));
        }, 2000);
      });
    }
  };
  const [rateSubmitted, setRateSubmitted] = useState(false);
  if (isLoading) {
    return (
      <div className="rating-box-contianer">
        <div className="rating-box">Loading...</div>
      </div>
    );
  }
  return (
    <div className="rating-box-contianer">
      <div className="rating-box">
        <div
          className={`rating-box-content-container ${
            rateSubmitted ? `hide-rating-box-content-container` : ``
          }`}
        >
          <div className="rating-stars">
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
          <button className="rating-button" on onClick={() => submitReview()}>
            <FontAwesomeIcon icon={faStarReg} />
            Rate
          </button>
        </div>
        <div
          className={`${
            rateSubmitted ? `rate-submitted` : `hide-rate-submitted`
          }`}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          <h1>Your rate has been submitted!</h1>
        </div>
        <FontAwesomeIcon
          icon={faXmark}
          className="x-mark"
          onClick={() => dispatch(closeRatingPopup(false))}
        />
      </div>
    </div>
  );
};

export default RatingBox;
