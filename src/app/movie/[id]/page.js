"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import "@/css/MovieDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

const MovieDetails = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState(null);
  const id = params.id;
  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        try {
          const movieResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const movieData = await movieResponse.json();
          setMovie(movieData);
          const castResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const castData = await castResponse.json();
          setCast(castData);
        } catch (error) {
          console.error("Error fetching movie details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found</p>;
  console.log(movie);
  console.log(cast.crew);
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
  console.log(cast.cast);
  return (
    <div>
      <Navbar></Navbar>
      <div className="movie-details-page">
        <div className="details-card">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title} Poster`}
          />
          <div className="details">
            <h1>{movie.title}</h1>
            <div className="date-time-rate">
              <div className="date-time">
                {movie.release_date && (
                  <p>{movie.release_date.split("-")[0]}</p>
                )}
                <p>&#8226;</p>
                <p>{formatRuntime(movie.runtime)}</p>
              </div>
              <div className="rating">
                <FontAwesomeIcon icon={faStar} />
                <p>
                  {movie.vote_average.toFixed(1)}
                  <span>/10</span>
                </p>
                <button>
                  <FontAwesomeIcon icon={faStarReg} />
                  Rate
                </button>
              </div>
            </div>
            <div className="genres">
              {movie.genres.map((genre) => (
                <p key={genre.id}>{genre.name}</p>
              ))}
            </div>
            <p className="movie-overview">{movie.overview}</p>
            <div className="languages">
              Languages:
              {movie.spoken_languages.map((lang) => (
                <p className="movie-language" key={lang.id}>
                  {lang.english_name}
                </p>
              ))}
            </div>
            <div className="director-writers">
              <p>
                Director:{" "}
                <Link href={"/"}>
                  {cast && cast.crew ? getDirectors(cast.crew) : "N/A"}
                </Link>
              </p>

              <p>
                Writers:{" "}
                {cast && cast.crew
                  ? getWriters(cast.crew).map((writer, index, array) => (
                      <span key={writer}>
                        <Link href={`/writers/${writer}`}>{writer}</Link>
                        {index < array.length - 1 && <span> &#8226; </span>}
                      </span>
                    ))
                  : "N/A"}
              </p>
            </div>

            <button>
              Add to Watchlist
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>
        </div>
        <div className="cast">
          <h1>Top Cast</h1>
          <div className="members">
            {cast.cast.slice(0, 10).map((member) => (
              <div className="cast-member">
                <Link href={"/"}>
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                        : `https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/no-image-avaiable.jpg?alt=media&token=f01f2f4a-c8db-4e5f-8f7f-c920219a77fd`
                    }
                    alt={member.name}
                  />
                </Link>
                <div className="member-name">
                  <Link href={"/"}>{member.name}</Link>
                  <p>{member.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
