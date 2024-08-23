import "../../css/TitleWideCard.css";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import MoviesCard from "./MoviesCard";
import { useSelector } from "react-redux";
import RemoveFromWatchlistBox from "./RemoveFromWatchlistBox";
import TitleWideCard from "./TitleWideCard";

export default function TopMovies({ id, type }) {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1050 },
      items: 2,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    tablet: {
      breakpoint: { max: 1050, min: 900 },
      items: 2,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    mobile: {
      breakpoint: { max: 900, min: 550 },
      items: 2,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    smallMobile: {
      breakpoint: { max: 550, min: 0 },
      items: 1,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
  };

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const [titles, setTitles] = useState([]);

  useEffect(() => {
    // Function to fetch movie data
    async function fetchMovies() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
        );
        const data = await response.json();
        setTitles(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);
  const showPopup = useSelector((state) => state.RemoveWatchlistPopup.value);
  return (
    <div className="top-movies">
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={false}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={false}
        keyBoardControl={false}
        customTransition="all 0.6s ease"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        // deviceType={this.props.deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {titles.map((title) => (
          <TitleWideCard key={title.id} title={title} />
        ))}
      </Carousel>
      {showPopup && <RemoveFromWatchlistBox></RemoveFromWatchlistBox>}
    </div>
  );
}
