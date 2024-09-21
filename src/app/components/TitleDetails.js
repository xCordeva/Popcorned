import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faStar,
  faCakeCandles,
  faLocationDot,
  faTrashCan,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import RatingBox from "./RatingBox";
import { useDispatch, useSelector } from "react-redux";
import { openRatingPopup } from "@/features/RatingPopup";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import RemoveFromWatchlistBox from "./RemoveFromWatchlistBox";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import useAuth from "@/Custom Hooks/useAuth";
import { showSignInMessagePopup } from "@/features/SignInMessagePopup";
import RemoveReviewBox from "./RemoveReviewBox";
import useAddToWatchlist from "@/Custom Hooks/useAddToWatchlist";

const TitleDetails = ({ details, cast, type, setClickedStar }) => {
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getDirectors = (crew) => {
    const seenIds = new Set();
    return crew
      .filter(
        (member) =>
          member.job === "Director" &&
          !seenIds.has(member.id) &&
          seenIds.add(member.id)
      )
      .map((director) => ({ name: director.name, id: director.id }));
  };

  const getWriters = (crew) => {
    const seenIds = new Set();

    // filter for writers
    let writers = crew
      .filter(
        (member) =>
          (member.job === "Writer" ||
            member.department === "Writing" ||
            member.known_for_department === "Writing") &&
          !seenIds.has(member.id) &&
          seenIds.add(member.id)
      )
      .map((writer) => ({ name: writer.name, id: writer.id }));

    // if theres no writers found filter for executive producers
    if (writers.length === 0) {
      writers = crew
        .filter(
          (member) =>
            member.job === "Executive Producer" &&
            !seenIds.has(member.id) &&
            seenIds.add(member.id)
        )
        .map((producer) => ({ name: producer.name, id: producer.id }));
    }

    return writers;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const ratingPopupOpen = useSelector((state) => state.RatingPopup.value);
  const dispatch = useDispatch();

  const { watchlist, isLoading } = useFetchWatchlist();

  const watchlistItem = watchlist.find(
    (item) => item.id === details.id && item.type === type
  );

  const { handleAddToWatchlist, handleRemoveFromListClick } =
    useAddToWatchlist();

  const { user } = useAuth();

  const showRemoveFromWatchlistPopup = useSelector(
    (state) => state.RemoveWatchlistPopup.value
  );
  const showRemoveReviewPopup = useSelector(
    (state) => state.RemoveReviewPopup.value
  );
  const handleRate = () => {
    if (!user) {
      dispatch(showSignInMessagePopup(true));
    } else {
      dispatch(openRatingPopup(true));
    }
  };
  const { reviews } = useFetchReviews();

  const userAlreadyReviewed = reviews.find(
    (review) =>
      review.titleId == details.id &&
      review.titleType === type &&
      (user ? review.userId === user.uid : false)
  );

  return (
    <div className="details-card">
      <img
        src={
          details.poster_path || details.profile_path
            ? `https://image.tmdb.org/t/p/w500${
                type === "movie" || type === "tv"
                  ? details.poster_path
                  : details.profile_path
              }`
            : "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
        }
        alt={`${details.title} Poster`}
      />
      <div className="title-type">
        <p>
          {type === "movie"
            ? "Movie"
            : type === "tv"
            ? "TV Show"
            : type === "person"
            ? "Person"
            : "Unknown"}
        </p>
      </div>
      <div className="details">
        <div className="name">
          <h1>{type == "movie" ? details.title : details.name}</h1>
          {type == "person" && (
            <h2>
              Known for {type === "person" && details.known_for_department}
            </h2>
          )}
        </div>
        {type !== "person" ? (
          <div className="date-time-rate">
            <div className="date-time">
              <p>
                {type === "movie"
                  ? details.release_date.split("-")[0]
                  : details.first_air_date.split("-")[0]}
              </p>
              <p>&#8226;</p>
              {type === "tv" && (
                <>
                  <p>{details.number_of_seasons} Seasons</p>
                  <p>&#8226;</p>
                  <p>{details.number_of_episodes} Episodes</p>
                </>
              )}
              {type === "movie" && <p>{formatRuntime(details.runtime)}</p>}
            </div>
            <div className="rating">
              <div className="rate-vote-count">
                <div className="rate-star">
                  <FontAwesomeIcon icon={faStar} />
                  <p>
                    {details.vote_average.toFixed(1)}
                    <span>/10</span>
                  </p>
                </div>
                <p className="votes-count">
                  Based on <span>{details.vote_count}</span>{" "}
                  {details.vote_count == 1 ? `vote` : `votes`}
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
              ) : userAlreadyReviewed ? (
                <div
                  className="rate-vote-count user-rate"
                  onClick={() => handleRate()}
                >
                  <div className="rate-star">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="user-rating-star"
                    />
                    <p>
                      {userAlreadyReviewed.rating}
                      <span>/10</span>
                    </p>
                  </div>
                  <p className="votes-count user-rating-text">Your Rating</p>
                </div>
              ) : (
                <button onClick={() => handleRate()}>
                  <FontAwesomeIcon icon={faStarReg} />
                  Rate
                </button>
              )}
            </div>
            {ratingPopupOpen && (
              <RatingBox
                details={details}
                cast={cast}
                type={type}
                id={details.id}
              ></RatingBox>
            )}
          </div>
        ) : (
          <div className="birth-location">
            <p>
              <FontAwesomeIcon icon={faCakeCandles} />
              Birthday:{" "}
              <span>
                {details.birthday ? (
                  <>
                    {details.birthday}
                    <span style={{ color: "white" }}> &#8226; </span>
                    {calculateAge(details.birthday)} years old
                  </>
                ) : (
                  "No info available"
                )}
              </span>
            </p>
            {details.deathday && (
              <p>
                <FontAwesomeIcon icon={faSkull} />
                Deathday: <span>{details.deathday}</span>
              </p>
            )}
            <p>
              <FontAwesomeIcon icon={faLocationDot} />
              Place of Birth:{" "}
              <span>
                {details.place_of_birth
                  ? details.place_of_birth
                  : `No info available`}
              </span>
            </p>
          </div>
        )}
        {type !== "person" && (
          <div className="genres">
            {details.genres.map((genre) => (
              <p key={genre.id}>{genre.name}</p>
            ))}
          </div>
        )}
        <p className="title-overview">
          {type !== "person" ? details.overview : details.biography}
        </p>
        {type !== "person" && (
          <div className="languages">
            Languages:
            {details.spoken_languages.map((lang) => (
              <p className="title-language" key={lang.iso_639_1}>
                {lang.english_name}
              </p>
            ))}
          </div>
        )}
        <div className="director-writers">
          {type === "movie" && (
            <p>
              {`Director${getDirectors(cast.crew).length > 1 ? "s" : ""}: `}
              {getDirectors(cast.crew).map((director, index, array) => (
                <span key={director.id}>
                  <Link
                    href={{
                      pathname: `/title/${director.id}`,
                      query: { type: "person" },
                    }}
                  >
                    {cast && cast.crew ? director.name : "N/A"}
                  </Link>
                  {index < array.length - 1 && <span> &#8226; </span>}
                </span>
              ))}
            </p>
          )}
          {type !== "person" && (
            <p>
              {type === "movie"
                ? `Writer${getWriters(cast.crew).length > 1 ? "s" : ""}: `
                : `Creator${getWriters(cast.crew).length > 1 ? "s" : ""}: `}
              {cast && cast.crew
                ? getWriters(cast.crew).map((writer, index, array) => (
                    <span key={writer.id}>
                      <Link
                        href={{
                          pathname: `/title/${writer.id}`,
                          query: { type: "person" },
                        }}
                      >
                        {writer.name}
                      </Link>
                      {index < array.length - 1 && <span> &#8226; </span>}
                    </span>
                  ))
                : "N/A"}
            </p>
          )}
        </div>

        {type !== "person" && !isLoading ? (
          watchlistItem ? (
            <button
              onClick={(event) =>
                handleRemoveFromListClick(
                  event,
                  watchlistItem.firebaseItemId,
                  details.id
                )
              }
              className="remove-item global-button"
            >
              Remove from watchlist
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          ) : (
            <button
              onClick={() =>
                handleAddToWatchlist(details, type, cast.cast.slice(0, 2))
              }
              className="add-to-watchlist global-button"
            >
              Add to Watch List
              <FontAwesomeIcon icon={faSquarePlus} />
            </button>
          )
        ) : (
          type !== "person" && (
            <div className="add-watchlist-loading">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/loading.gif?alt=media&token=fb93d855-3412-4e08-bf85-a696cc68004a"
                alt="loading-gif"
              />
            </div>
          )
        )}
      </div>
      {showRemoveFromWatchlistPopup && (
        <RemoveFromWatchlistBox></RemoveFromWatchlistBox>
      )}
      {showRemoveReviewPopup && (
        <RemoveReviewBox setClickedStar={setClickedStar}></RemoveReviewBox>
      )}
    </div>
  );
};

export default TitleDetails;
