"use client";
import useFetchWatchlist from "@/Custom Hooks/useFetchWatchlist";
import Navbar from "@/app/components/Navbar";
import Watchlist from "@/app/components/Watchlist";
import "@/css/Watchlist.css";

export default function WatchlistPage() {
  const { isLoading } = useFetchWatchlist();
  if (isLoading)
    return (
      <div className="page-loading">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
          alt="loading-gif"
        />
        <p>Loading...</p>
      </div>
    );
  return (
    <div>
      <Navbar></Navbar>
      <div className="watchlist-page">
        <Watchlist></Watchlist>
      </div>
    </div>
  );
}
