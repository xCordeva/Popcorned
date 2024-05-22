import React from "react";

const MovieDetails = () => {
  useEffect(() => {
    // Function to fetch movie data
    async function fetchMovies() {
      try {
        const response = await fetch(
          `${apiUrl}/movie/${movie.id}?api_key=${apiKey}`
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    fetchMovies();
  }, []);
  return (
    <div className="movie-details-page">
      <h1>Movies Name</h1>
      <p>Release Date</p>
      <p>overview</p>
    </div>
  );
};

export default MovieDetails;
