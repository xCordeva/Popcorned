import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faCakeCandles,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

const titleDetails = ({ details, cast, type }) => {
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  const getDirectors = (crew) => {
    return crew
      .filter((member) => member.job === "Director")
      .map((director) => director.name);
  };
  const getWriters = (crew) => {
    return crew
      .filter(
        (member) => member.job === "Writer" || member.department === "Writing"
      )
      .map((writer) => writer.name);
  };
  // console.log(cast.crew);
  return (
    <div className="details-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${
          type === "movie" || type === "tv"
            ? details.poster_path
            : details.profile_path
        }`}
        alt={`${details.title} Poster`}
      />
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
              <button>
                <FontAwesomeIcon icon={faStarReg} />
                Rate
              </button>
            </div>
          </div>
        ) : (
          <div className="birth-location">
            <p>
              <FontAwesomeIcon icon={faCakeCandles} />
              Birthday: <span>{details.birthday}</span>
            </p>
            {details.deathday && <p>Deathday :{details.birthday}</p>}
            <p>
              <FontAwesomeIcon icon={faLocationDot} />
              Place of Birth: <span>{details.place_of_birth}</span>
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
              Director:{" "}
              <Link href={"/"}>
                {cast && cast.crew ? getDirectors(cast.crew) : "N/A"}
              </Link>
            </p>
          )}
          {type !== "person" && (
            <p>
              {type === "movie" ? "Writers: " : "Creators: "}
              {cast && cast.crew
                ? getWriters(cast.crew).map((writer, index, array) => (
                    <span key={writer}>
                      <Link href={`/writers/${writer}`}>{writer}</Link>
                      {index < array.length - 1 && <span> &#8226; </span>}
                    </span>
                  ))
                : "N/A"}
            </p>
          )}
        </div>

        {type !== "person" && (
          <button>
            Add to Watchlist
            <FontAwesomeIcon icon={faHeart} />
          </button>
        )}
      </div>
    </div>
  );
};

export default titleDetails;
