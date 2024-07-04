import "@/css/Review.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export default function Review({ review, index, editReview }) {
  const [editedReview, setEditedReview] = useState(review.reviewDetails);

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
        <p className={`review-details ${editReview ? "hide" : ""}`}>
          {review.reviewDetails}
        </p>
        <textarea
          className={`edit-review-textarea ${editReview ? "show" : ""}`}
          value={editedReview}
          onChange={(event) => setEditedReview(event.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
