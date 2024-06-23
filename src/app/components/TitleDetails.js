import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faCakeCandles,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import RatingBox from "./RatingBox";
import { useDispatch, useSelector } from "react-redux";
import RatingPopup, { openRatingPopup } from "@/features/RatingPopup";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";

const TitleDetails = ({ details, cast, type }) => {
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

  const { addToWatchlist } = useFetchWatchlist();

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
              <FontAwesomeIcon icon={faStar} />
              <p>
                {details.vote_average.toFixed(1)}
                <span>/10</span>
              </p>
              <button onClick={() => dispatch(openRatingPopup(true))}>
                <FontAwesomeIcon icon={faStarReg} />
                Rate
              </button>
            </div>
            {ratingPopupOpen && <RatingBox></RatingBox>}
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
            {details.deathday && <p>Deathday :{details.birthday}</p>}
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
                    key={director.id}
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
                    <span key={writer}>
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

        {type !== "person" && (
          <button
            className="global-button"
            onClick={() => addToWatchlist(details, type, cast.cast.slice(0, 2))}
          >
            Add to Watchlist
            <FontAwesomeIcon icon={faHeart} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TitleDetails;
