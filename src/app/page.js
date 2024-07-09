"use client";
import Navbar from "./components/Navbar";
import MainPageSearch from "./components/MainPageSearch";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import PopularMovies from "./components/PopularMovies";
import { useSelector } from "react-redux";
import SignInMessage from "./components/SignInMessage";

export default function Home() {
  usePopupCloser();
  const showSignInMessagePopup = useSelector(
    (state) => state.SignInMessagePopup.value
  );
  return (
    <div>
      <Navbar></Navbar>
      <MainPageSearch></MainPageSearch>
      <div className="popular-movies-carousel">
        <h1 id="popular-movies">Popular Movies</h1>
        <PopularMovies></PopularMovies>
      </div>
      {showSignInMessagePopup && <SignInMessage></SignInMessage>}
    </div>
  );
}
