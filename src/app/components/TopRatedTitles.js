import "../../css/TitleWideCard.css";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";
import RemoveFromWatchlistBox from "./RemoveFromWatchlistBox";
import TitleWideCard from "./TitleWideCard";

export default function TopRatedTitles({ type }) {
  const responsive = {
    bigDesktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 2,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    desktop: {
      breakpoint: { max: 1200, min: 0 },
      items: 1,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
  };

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const [titles, setTitles] = useState([]);

  useEffect(() => {
    // Function to fetch movie data
    async function fetchTitles() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/top_rated?api_key=${apiKey}`
        );
        const data = await response.json();
        setTitles(data.results);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    }
    fetchTitles();
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
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {titles.map((title) => (
          <TitleWideCard key={title.id} title={title} type={type} />
        ))}
      </Carousel>
      {showPopup && <RemoveFromWatchlistBox></RemoveFromWatchlistBox>}
    </div>
  );
}
