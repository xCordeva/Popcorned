"use client";
import Navbar from "./components/Navbar";
import MainPageSearch from "./components/MainPageSearch";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import { useSelector } from "react-redux";
import SignInMessage from "./components/SignInMessage";
import FromYourWatchlist from "./components/FromYourWatchlist";
import TrendingTitles from "./components/TrendingTitles";
import TopRatedTitles from "./components/TopRatedTitles";
import Footer from "./components/Footer";

export default function Home() {
  usePopupCloser();
  const showSignInMessagePopup = useSelector(
    (state) => state.SignInMessagePopup.value
  );
  return (
    <div>
      <Navbar></Navbar>
      <MainPageSearch></MainPageSearch>
      <div className="main-page">
        <div className="main-page-carousel">
          <h1 id="trending-movies">Trending Movies</h1>
          <TrendingTitles type={"movie"}></TrendingTitles>
        </div>

        <div className="main-page-carousel">
          <h1 id="trending-tv-shows">Trending Tv Shows</h1>
          <TrendingTitles type={"tv"}></TrendingTitles>
        </div>
        <div className="main-page-carousel">
          <h1 id="top-movies">Top Rated Movies</h1>
          <TopRatedTitles type={"movie"}></TopRatedTitles>
        </div>
        <div className="main-page-carousel">
          <h1 id="top-tv-shows">Top Rated Tv Shows</h1>
          <TopRatedTitles type={"tv"}></TopRatedTitles>
        </div>
        <div className="main-page-carousel">
          <h1 id="from-watchlist">From Your Watchlist</h1>
          <FromYourWatchlist></FromYourWatchlist>
        </div>
      </div>
      <Footer />
      {showSignInMessagePopup && <SignInMessage></SignInMessage>}
    </div>
  );
}
