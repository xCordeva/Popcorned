"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/css/global.css";
import Navbar from "@/app/components/Navbar";

const MovieDetails = ({ params }) => {
  const router = useRouter();
  //   const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState(null);
  console.log(router);
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
  console.log(cast);
  async function getStaticPaths() {
    return {
      paths: [
        { params: { slug: [] } }, // Empty slug represents the homepage
        { params: { slug: ["movie"] } }, // Empty slug represents the homepage
        // Add other paths as needed for specific routes
        // Example: { params: { slug: ['foo'] } },
        // Example: { params: { slug: ['bar'] } },
      ],
      fallback: false, // Set to true if you want to use incremental static regeneration
    };
  }
  return (
    <div>
      <Navbar></Navbar>
      <div className="movie-details-page">
        <h1>{movie.title}</h1>
        <div className="details">
          <p>{movie.release_date}</p>
          <p>{movie.runtime}</p>
          <p>{movie.overview}</p>
        </div>
        <div className="genres">
          {movie.genres.map((genre) => (
            <p key={genre.id}>{genre.name}</p>
          ))}
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`${movie.title} Poster`}
        />
      </div>
    </div>
  );
};

export default MovieDetails;
