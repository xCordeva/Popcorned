"use client";
import Navbar from "./components/Navbar";
import MainPageSearch from "./components/MainPageSearch";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import PopularMovies from "./components/PopularMovies";

export default function Home() {
  usePopupCloser();
  return (
    <div>
      <Navbar></Navbar>
      <MainPageSearch></MainPageSearch>
      <PopularMovies></PopularMovies>
    </div>
  );
}
