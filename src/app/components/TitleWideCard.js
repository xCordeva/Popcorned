import Link from "next/link";
import "../../css/TitleWideCard.css";
import MiniTitleCard from "./MiniTitleCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function TitleWideCard({ title, type }) {
  return (
    <div className="title-wide-card" key={title.id}>
      <Link
        href={{
          pathname: `/title/${title.id}`,
          query: { type },
        }}
      >
        <div className="wide-card-content">
          <img
            src={`https://image.tmdb.org/t/p/original/${title.backdrop_path}`}
            alt={`${title.title || title.name} famous frame`}
            loading="lazy"
          />
          <div className="title-details">
            <h1>{title.title || title.name}</h1>
            <div className="rating">
              <FontAwesomeIcon icon={faStar} />
              <h1>{title.vote_average.toFixed(1)}</h1>
            </div>
          </div>
        </div>
        <div className="mini-card">
          <MiniTitleCard title={title} type={type}></MiniTitleCard>
        </div>
      </Link>
    </div>
  );
}
