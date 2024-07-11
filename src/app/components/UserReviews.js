import "@/css/UserReviews.css";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import useAuth from "@/Custom Hooks/useAuth";
import Review from "./Review";
import Link from "next/link";

export default function UserReviews({ id, type }) {
  const { reviews, isLoading } = useFetchReviews();

  const { user } = useAuth();

  const filteredReviews = reviews.filter(
    (review) => review.titleId === id && review.titleType === type
  );
  const reviewsWithDetails = filteredReviews.filter(
    (review) => review.reviewDetails !== ""
  );

  // if(isLoading){
  //   return()
  // }

  return (
    <div className="user-reviews">
      <div className="title-reviews-number">
        <h1>User Reviews</h1>
        {reviewsWithDetails.length > 0 && (
          <h2>
            {reviewsWithDetails.length}{" "}
            {reviewsWithDetails.length === 1 ? "Review" : "Reviews"}
          </h2>
        )}
      </div>
      <div className="reviews">
        {filteredReviews.length > 0 ? (
          filteredReviews.slice(0, 2).map((review, index) =>
            review.reviewDetails ? (
              <Review review={review} index={index}></Review>
            ) : (
              <div className="no-reviews">
                No reviews yet. <br />
                Be the first to share your thoughts on this title!
              </div>
            )
          )
        ) : (
          <div className="no-reviews">
            No reviews yet. <br />
            Be the first to share your thoughts on this title!
          </div>
        )}
        {filteredReviews.length > 2 ? (
          <Link
            href={{
              pathname: `/title/${id}/reviews`,
              query: { type },
            }}
          >
            <h1>Show all user reviews</h1>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
