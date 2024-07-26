import "@/css/UserReviews.css";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import Review from "./Review";
import Link from "next/link";

export default function UserReviews({ id, type, clickedStar, setClickedStar }) {
  const { reviews, isLoading } = useFetchReviews();

  const filteredReviews = reviews.filter(
    (review) => review.titleId == id && review.titleType === type
  );
  const reviewsWithDetails = filteredReviews.filter(
    (review) => review.reviewDetails !== ""
  );

  if (isLoading) {
    return (
      <div className="secondary-loading user-reviews-loading">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/loading.gif?alt=media&token=fb93d855-3412-4e08-bf85-a696cc68004a"
          alt="loading-gif"
        />
        <p>Loading...</p>
      </div>
    );
  }

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
          reviewsWithDetails.length > 0 ? (
            reviewsWithDetails
              .slice(0, 2)
              .map((review, index) => (
                <Review
                  review={review}
                  index={index}
                  clickedStar={clickedStar}
                  setClickedStar={setClickedStar}
                  key={index}
                />
              ))
          ) : (
            <div className="no-reviews">
              No reviews yet. <br />
              Be the first to share your thoughts on this title!
            </div>
          )
        ) : (
          <div className="no-reviews">
            No reviews yet. <br />
            Be the first to share your thoughts on this title!
          </div>
        )}
        {filteredReviews.length > 2 && (
          <Link
            href={{
              pathname: `/title/${id}/reviews`,
              query: { type },
            }}
          >
            <h1>Show all user reviews</h1>
          </Link>
        )}
      </div>
    </div>
  );
}
