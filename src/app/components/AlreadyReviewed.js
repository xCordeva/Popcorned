import "@/css/AlreadyReviewed.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAlreadyReviewedPopup } from "@/features/AlreadyReviewedPopup";
import Review from "./Review";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { triggerRefetch } from "@/features/RefetchReviews";

const AlreadyReviewed = ({ review }) => {
  const dispatch = useDispatch();

  const [editReviewClicked, setEditReviewClicked] = useState(false);
  const [editedReviewText, setEditedReviewText] = useState(
    review.reviewDetails
  );
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);
  const [editedReviewSubmitted, setEditedReviewSubmitted] = useState(false);

  const { editReview } = useFetchReviews();

  const handleEditReview = () => {
    if (editReviewClicked) {
      editReview(
        { ...review, reviewDetails: editedReviewText },
        review.firebaseItemId
      ).then(() => {
        setEditedReviewSubmitted(true);
        setTimeout(() => {
          setEditedReviewSubmitted(false);
          dispatch(triggerRefetch(!refetchReviews));
          dispatch(closeAlreadyReviewedPopup(false));
        }, 2000);
      });
    }
  };

  return (
    <div className="already-reviewed-contianer">
      <div className="already-reviewed-box">
        <div
          className={`already-reviewed-content-contianer ${
            editedReviewSubmitted
              ? `hide-already-reviewed-content-contianer`
              : ``
          }`}
        >
          <h2>Looks like you have already reviewed this title</h2>
          <div className="rating-review">
            <Review
              review={review}
              editReview={editReviewClicked}
              editedReviewText={editedReviewText}
              setEditedReviewText={setEditedReviewText}
            ></Review>
            <div className="buttons">
              <button
                onClick={() => dispatch(closeAlreadyReviewedPopup(false))}
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setEditReviewClicked(true);
                  handleEditReview();
                }}
              >
                {editReviewClicked ? `Submit Review` : `Edit Review`}
              </button>
            </div>
          </div>
        </div>
        <div
          className={`hide-rate-submitted ${
            editedReviewSubmitted ? `rate-submitted` : ``
          }`}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          <h1>Your review has been submitted!</h1>
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
  );
};

export default AlreadyReviewed;
