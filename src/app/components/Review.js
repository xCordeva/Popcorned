import "@/css/Review.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export default function Review({
  review,
  editReview,
  index,
  editedReviewText,
  setEditedReviewText,
}) {
  return (
    <div className="review" key={index}>
      <img
        src="https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
        alt=""
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
        <p className={`review-details rev-det ${editReview ? "hide" : ""}`}>
          {review.reviewDetails}
        </p>
        <textarea
          className={`edit-review-textarea ${editReview ? "show" : ""}`}
          value={editedReviewText}
          onChange={(event) => setEditedReviewText(event.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
