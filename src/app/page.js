"use client";
import Navbar from "./components/Navbar";
import MainPageSearch from "./components/MainPageSearch";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import PopularMovies from "./components/PopularMovies";
// import { getStaticPaths } from "@/pages/[[...slug]";

export default function Home() {
  usePopupCloser();

  return (
    <div>
      <Navbar></Navbar>
      <MainPageSearch></MainPageSearch>
      <div className="popular-movies-carousel">
        <h1 id="popular-movies">Popular Movies</h1>
        <PopularMovies></PopularMovies>
      </div>
    </div>
  );
}
