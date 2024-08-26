import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";
import RemoveFromWatchlistBox from "./RemoveFromWatchlistBox";
import TitlesCard from "./TitlesCard";

export default function TrendingTitles({ type }) {
  const responsive = {
    bigDesktop: {
      breakpoint: { max: 3000, min: 1800 },
      items: 5,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    desktop: {
      breakpoint: { max: 1800, min: 1500 },
      items: 4,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    smallDesktop: {
      breakpoint: { max: 1500, min: 1024 },
      items: 3,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    tablet: {
      breakpoint: { max: 1024, min: 700 },
      items: 2,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    mobile: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
  };

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const apiUrl = "https://api.themoviedb.org/3";

  const [titles, setTitles] = useState([]);

  useEffect(() => {
    // Function to fetch title data
    async function fetchTitles() {
      try {
        const response = await fetch(
          `${apiUrl}/trending/${type}/week?api_key=${apiKey}`
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
    <div>
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={false}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={false}
        keyBoardControl={false}
        customTransition="all 0.4s ease"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        // deviceType={this.props.deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {titles.map((title) => (
          <TitlesCard key={title.id} title={title} type={type} />
        ))}
      </Carousel>
      {showPopup && <RemoveFromWatchlistBox></RemoveFromWatchlistBox>}
    </div>
  );
}
