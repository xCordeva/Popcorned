"use client";
import Navbar from "./components/Navbar";
import MainPageSearch from "./components/MainPageSearch";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import PopularMovies from "./components/PopularMovies";
import { useSelector } from "react-redux";
import SignInMessage from "./components/SignInMessage";
import FromYourWatchlist from "./components/FromYourWatchlist";
import TopMovies from "./components/TopMovies";
import TopTvShows from "./components/TopTvShows";

export default function Home() {
  usePopupCloser();
  const showSignInMessagePopup = useSelector(
    (state) => state.SignInMessagePopup.value
  );
  return (
    <div>
      <Navbar></Navbar>
      <MainPageSearch></MainPageSearch>
      <div className="main-page-carousel">
        <h1 id="popular-movies">Popular Movies</h1>
        <PopularMovies></PopularMovies>
      </div>
      <div className="main-page-carousel">
        <h1 id="top-movies">Top Rated Movies</h1>
        <TopMovies></TopMovies>
      </div>
      <div className="main-page-carousel">
        <h1 id="top-tv-shows">Top Rated Tv Shows</h1>
        <TopTvShows></TopTvShows>
      </div>
      <div className="main-page-carousel">
        <h1 id="from-watchlist">From Your Watchlist</h1>
        <FromYourWatchlist></FromYourWatchlist>
      </div>
      {showSignInMessagePopup && <SignInMessage></SignInMessage>}
    </div>
  );
}
