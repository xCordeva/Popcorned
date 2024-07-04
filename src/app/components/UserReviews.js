import "@/css/UserReviews.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import useAuth from "@/Custom Hooks/useAuth";

export default function UserReviews({ id, type }) {
  const { reviews } = useFetchReviews();

  const { user } = useAuth();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const filteredReviews = reviews.filter(
    (review) => review.titleId === id && review.titleType === type
  );

  return (
    <div className="user-reviews">
      <h1>User Reviews</h1>
      <div className="reviews">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) =>
            review.reviewDetails ? (
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
                          ? formatDate(review.createdAt.seconds)
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
                  <p className="review-details">{review.reviewDetails}</p>
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="no-reviews">
            No reviews yet. <br />
            Be the first to share your thoughts on this title!
          </div>
        )}
      </div>
    </div>
  );
}
