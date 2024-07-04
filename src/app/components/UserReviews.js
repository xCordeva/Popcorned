import "@/css/UserReviews.css";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import useAuth from "@/Custom Hooks/useAuth";
import Review from "./Review";

export default function UserReviews({ id, type }) {
  const { reviews } = useFetchReviews();

  const { user } = useAuth();

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
              <Review review={review} index={index}></Review>
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
