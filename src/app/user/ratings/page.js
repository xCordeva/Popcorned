"use client";
import useAuth from "@/Custom Hooks/useAuth";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";
import Navbar from "@/app/components/Navbar";
import Ratings from "@/app/components/Ratings";
import "@/css/Ratings.css";

export default function RatingsPage() {
  usePopupCloser();
  const { loading } = useAuth();
  const { isLoading } = useFetchReviews();
  if (loading || isLoading)
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
      <div className="ratings-page">
        <Ratings></Ratings>
      </div>
    </div>
  );
}
