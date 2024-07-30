import "@/css/Review.css";
import useAuth from "@/Custom Hooks/useAuth";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { triggerRefetch } from "@/features/RefetchReviews";
import { openRemoveReviewPopup } from "@/features/RemoveReviewPopup";
import {
  faStar,
  faPen,
  faTrashCan,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export default function Review({
  review,
  editReviewAlreadyRevPopup,
  editedReviewTextAlreadyRevPopup,
  setEditedReviewTextAlreadyRevPopup,
}) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [editReviewClicked, setEditReviewClicked] = useState(false);
  const [editedReviewText, setEditedReviewText] = useState(
    review.reviewDetails
  );
  const refetchReviews = useSelector((state) => state.RefetchReviews.value);

  const { editReview } = useFetchReviews();

  const handleEditReview = () => {
    if (editReviewClicked || editReviewAlreadyRevPopup) {
      editReview(
        { ...review, reviewDetails: editedReviewText },
        review.firebaseItemId
      ).then(() => {
        setEditReviewClicked(false);
        dispatch(triggerRefetch(!refetchReviews));
      });
    }
  };
  const alreadyReviewedPopup = useSelector(
    (state) => state.AlreadyReviewedPopup.value
  );
  return (
    <div className="review">
      <div className="desktop-review-container">
        <img
          src={
            user && review.userId === user.uid
              ? user?.photoURL
              : "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
          }
          alt={
            user && review.userId === user.uid
              ? `${user?.displayName}'s profile picture`
              : "Default user profile icon"
          }
        />

        <div className="username-details">
          <div className="username-rate">
            <div className="username-date">
              <p className="username">
                {review.username ? review.username : "Anonymous"}
              </p>
              <p className="date-time">
                {review.createdAt
                  ? formatDate(
                      review.createdAt.seconds || review.createdAt.timestamp
                    )
                  : "Unknown date"}
              </p>
            </div>
            <div className="rating">
              <FontAwesomeIcon icon={faStar} />
              <p>
                {review.rating}
                <span>/10</span>
              </p>
            </div>
          </div>

          <p
            className={`review-details rev-det ${
              editReviewClicked || editReviewAlreadyRevPopup ? "hide" : ""
            }`}
          >
            {review.reviewDetails}
          </p>
          <textarea
            className={`edit-review-textarea ${
              editReviewClicked || editReviewAlreadyRevPopup ? "show" : ""
            }`}
            value={
              editReviewAlreadyRevPopup
                ? editedReviewTextAlreadyRevPopup
                : editedReviewText
            }
            onChange={(event) =>
              editReviewAlreadyRevPopup
                ? setEditedReviewTextAlreadyRevPopup(event.target.value)
                : setEditedReviewText(event.target.value)
            }
          ></textarea>
        </div>
      </div>
      {/* I know repeating code and using this way to handle a problem of mobile viewing is not the most efficient way but here I am doing it anyways */}
      <div className="mobile-review-container">
        <div className="img-details-contianer">
          <img
            src={
              user && review.userId === user.uid
                ? user?.photoURL
                : "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
            }
            alt={
              user && review.userId === user.uid
                ? `${user?.displayName}'s profile picture`
                : "Default user profile icon"
            }
          />
          <div className="username-date-time">
            <div className="username-rate">
              <div className="username-date">
                <p className="username">
                  {review.username ? review.username : "Anonymous"}
                </p>
                <p className="date-time">
                  {review.createdAt
                    ? formatDate(
                        review.createdAt.seconds || review.createdAt.timestamp
                      )
                    : "Unknown date"}
                </p>
              </div>
              <div className="rating">
                <FontAwesomeIcon icon={faStar} />
                <p>
                  {review.rating}
                  <span>/10</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p
          className={`review-details rev-det ${
            editReviewClicked || editReviewAlreadyRevPopup ? "hide" : ""
          }`}
        >
          {review.reviewDetails}
        </p>
        <textarea
          className={`edit-review-textarea ${
            editReviewClicked || editReviewAlreadyRevPopup ? "show" : ""
          }`}
          value={
            editReviewAlreadyRevPopup
              ? editedReviewTextAlreadyRevPopup
              : editedReviewText
          }
          onChange={(event) =>
            editReviewAlreadyRevPopup
              ? setEditedReviewTextAlreadyRevPopup(event.target.value)
              : setEditedReviewText(event.target.value)
          }
        ></textarea>
      </div>
      {alreadyReviewedPopup
        ? null
        : user &&
          review.userId === user.uid && (
            <div className="user-control-icons">
              <FontAwesomeIcon
                icon={faTrashCan}
                onClick={() =>
                  dispatch(openRemoveReviewPopup(review.firebaseItemId))
                }
              />
              <FontAwesomeIcon
                icon={
                  editReviewClicked || editReviewAlreadyRevPopup
                    ? faCheck
                    : faPen
                }
                onClick={() => {
                  setEditReviewClicked(true);
                  setEditedReviewText(review.reviewDetails);
                  handleEditReview();
                }}
              />
            </div>
          )}
    </div>
  );
}
