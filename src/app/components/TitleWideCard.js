import Link from "next/link";
import "../../css/TitleWideCard.css";
import MiniTitleCard from "./MiniTitleCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function TitleWideCard({ title }) {
  return (
    <div className="title-wide-card" key={title.id}>
      <Link
        href={{
          pathname: `/title/${title.id}`,
          query: { type: "movie" },
        }}
      >
        <div className="wide-card-content">
          <img
            src={`https://image.tmdb.org/t/p/original/${title.backdrop_path}`}
            alt={`${title.title} famous frame`}
            loading="lazy"
          />

          <div className="title-details">
            <h1>{title.title}</h1>
            <div className="rating">
              <FontAwesomeIcon icon={faStar} />
              <h1>{title.vote_average.toFixed(1)}</h1>
            </div>
          </div>
        </div>
        <div className="mini-card-plot">
          <div className="movie-plot">
            {title.overview.length > 0 ? title.overview : `No Plot Available`}
            {title.overview}
          </div>
          <MiniTitleCard title={title}></MiniTitleCard>
        </div>
      </Link>
    </div>
  );
}
