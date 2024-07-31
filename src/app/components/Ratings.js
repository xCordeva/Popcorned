import RemoveReviewBox from "./RemoveReviewBox";
import Link from "next/link";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { openRatingPopup } from "@/features/RatingPopup";
import RatingBox from "./RatingBox";
import { useState } from "react";
import { openRemoveReviewPopup } from "@/features/RemoveReviewPopup";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export default function Ratings() {
  const dispatch = useDispatch();
  const showRemoveReviewPopup = useSelector(
    (state) => state.RemoveReviewPopup.value
  );
  const ratingPopupOpen = useSelector((state) => state.RatingPopup.value);

  const { reviews, isLoading } = useFetchReviews();
  const [clickedRatedTitleId, setClickedRatedTitleId] = useState("");
  const [clickedRatedTitleType, setClickedRatedTitleType] = useState("");

  if (reviews < 1 && !isLoading) {
    return (
      <div className="ratings-section">
        <h1>Your Ratings</h1>
        <div className="ratings-not-found">
          <h1>Nothing here yet!</h1>
          <Link href={`/#popular-movies`}>
            Start rating your favorite titles now!
          </Link>
        </div>
      </div>
    );
  }

  const handleRate = (e, titleId, titleType) => {
    e.preventDefault();
    dispatch(openRatingPopup(titleType));
    setClickedRatedTitleId(titleId);
    setClickedRatedTitleType(titleType);
  };

  return (
    <div className="ratings-section">
      <h1>Your Ratings</h1>
      <p>
        You rated {reviews.length} {reviews.length === 1 ? "title" : "titles"}.
      </p>
      <div className="ratings-items">
        {reviews.map((item) => (
          <Link
            href={{
              pathname: `/title/${item.titleId}`,
              query: { type: item.titleType },
            }}
            className="ratings-item"
            key={item.titleId}
          >
            <img
              src={
                item.details.poster_path || item.details.profile_path
                  ? item.details.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.details.poster_path}`
                    : `https://image.tmdb.org/t/p/w500${item.details.profile_path}`
                  : "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
              }
              alt={item.details.title + " Poster"}
            />
            <div className="item-type">
              <p>
                {item.titleType === "movie"
                  ? "Movie"
                  : item.titleType === "tv"
                  ? "TV Show"
                  : "Unknown"}
              </p>
            </div>

            <div className="item-details">
              <div className="title-rate">
                <h1>
                  {item.details.title ? item.details.title : item.details.name}
                </h1>
                <div className="rating">
                  <div className="rate-vote-count">
                    <div className="rate-star">
                      <FontAwesomeIcon icon={faStar} />
                      <p>
                        {item.details.vote_average.toFixed(1)}
                        <span>/10</span>
                      </p>
                    </div>
                    <p className="votes-count">
                      Based on <span>{item.details.vote_count}</span>{" "}
                      {item.details.vote_count === 1 ? "vote" : "votes"}
                    </p>
                  </div>
                  {isLoading ? (
                    <div className="your-rating-loading">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/loading.gif?alt=media&token=fb93d855-3412-4e08-bf85-a696cc68004a"
                        alt="loading-gif"
                      />
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <div
                      className="rate-vote-count user-rate"
                      onClick={(e) =>
                        handleRate(e, item.titleId, item.titleType)
                      }
                    >
                      <div className="rate-star">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="user-rating-star"
                        />
                        <p>
                          {item.rating}
                          <span>/10</span>
                        </p>
                      </div>
                      <p className="votes-count user-rating-text">
                        Your Rating
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <p>
                <span style={{ color: "grey" }}>Rated on </span>
                {formatDate(item.createdAt.seconds)}
              </p>
              {item.topCast && (
                <div className="top-cast">
                  {item.topCast.map((castMember, index) => (
                    <div key={castMember.id}>
                      <Link
                        href={{
                          pathname: `/title/${castMember.id}`,
                          query: { type: "person" },
                        }}
                      >
                        {castMember.name}
                      </Link>
                      {index < item.topCast.length - 1 && <p>, </p>}
                    </div>
                  ))}
                </div>
              )}
              {(item.details.release_date || item.details.first_air_date) && (
                <h3>
                  {item.details.release_date
                    ? item.details.release_date.split("-")[0]
                    : item.details.first_air_date.split("-")[0]}
                </h3>
              )}
              <button
                className="remove-item global-button"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(openRemoveReviewPopup(item.firebaseItemId));
                }}
              >
                Remove Rating
              </button>
            </div>
          </Link>
        ))}
      </div>
      {ratingPopupOpen && (
        <RatingBox
          type={clickedRatedTitleType}
          id={clickedRatedTitleId}
        ></RatingBox>
      )}
      {showRemoveReviewPopup && <RemoveReviewBox></RemoveReviewBox>}
    </div>
  );
}
