import Link from "next/link";
import { faSquarePlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PersonsWork({ work }) {
  return (
    <Link
      href={`/title/${work.id}?type=${work.media_type}`}
      className="the-work"
    >
      <img
        src={
          work.poster_path
            ? `https://image.tmdb.org/t/p/w500${work.poster_path}`
            : "https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd"
        }
        alt={work.title + ` Poster`}
      />
      <div className="work-type">
        <p>
          {work.media_type === "movie"
            ? "Movie"
            : work.media_type === "tv"
            ? "TV Show"
            : "Unknown"}
        </p>
      </div>

      <div className="work-details">
        <div className="title-rate">
          <h1>{work.title ? work.title : work.name}</h1>
          <div className="rating">
            {work.vote_average !== 0 && work.vote_average && (
              <p>
                <FontAwesomeIcon icon={faStar} />
                {work.vote_average.toFixed(1)}
                <span>/10</span>
              </p>
            )}
          </div>
        </div>
        <h3 className="character-name">
          {work.character ? work.character : work.job}
        </h3>
        {(work.release_date || work.first_air_date) && (
          <h3>
            {work.release_date
              ? work.release_date.split("-")[0]
              : work.first_air_date.split("-")[0]}
          </h3>
        )}

        {work.type !== "person" && (
          <Link href={"/"} className="add-watchlist global-button">
            Add to Watch List
            <FontAwesomeIcon icon={faSquarePlus} />
          </Link>
        )}
      </div>
    </Link>
  );
}
