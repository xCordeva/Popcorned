"use client";
import Navbar from "@/app/components/Navbar";
import Watchlist from "@/app/components/Watchlist";
import "@/css/Watchlist.css";

export default function WatchlistPage() {
  return (
    <div className="watchlist-page">
      <Navbar></Navbar>
      <Watchlist></Watchlist>
    </div>
  );
}
