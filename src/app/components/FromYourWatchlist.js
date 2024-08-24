import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";
import RemoveFromWatchlistBox from "./RemoveFromWatchlistBox";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import { Link as SmoothLink } from "react-scroll";
import useAuth from "@/Custom Hooks/useAuth";
import TitlesCard from "./TitlesCard";

export default function FromYourWatchlist() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      partialVisibilityGutter: 0, // this is needed to tell the amount of px that should be visible.
    },
  };
  const { watchlist } = useFetchWatchlist();
  const { user } = useAuth();
  const showPopup = useSelector((state) => state.RemoveWatchlistPopup.value);
  if (!user) {
    return (
      <div className="watchlist-section">
        <div className="watchlist-not-found">
          <h1>You need to sign in to view your watchlist.</h1>
          <Link href={`/sign-in`}>Sign In</Link>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-section">
        <div className="watchlist-not-found">
          <h1>Nothing here yet!</h1>
          <SmoothLink to="trending-movies" smooth={true} duration={500}>
            Start adding your favorite titles now!
          </SmoothLink>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Carousel
        swipeable={false}
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
        {watchlist.map((title) => (
          <TitlesCard key={title.id} title={title} type={title.type} />
        ))}
      </Carousel>
      {showPopup && <RemoveFromWatchlistBox></RemoveFromWatchlistBox>}
    </div>
  );
}
