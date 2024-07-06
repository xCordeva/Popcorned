"use client";
import "@/css/ReviewsPage.css";
import Navbar from "@/app/components/Navbar";
import Review from "@/app/components/Review";
import useFetchReviews from "@/Custom Hooks/useFetchReviews";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const api_key = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function page({ params }) {
  const { reviews, isLoading } = useFetchReviews();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState({});
  const [loading, setLoading] = useState(true);
  const type = searchParams.get("type");

  const id = params.id;

  const filteredReviews = reviews.filter(
    (review) => review.titleId === id && review.titleType === type
  );

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const titleResponse = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${api_key}`
        );

        if (!titleResponse.ok) {
          throw new Error("Failed to fetch title information");
        }

        const titleData = await titleResponse.json();
        setTitle(titleData);
      } catch (error) {
        console.error("Error fetching title:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTitle();
  }, [id, type]);

  if (isLoading || loading)
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
      <Navbar />
      <div className="reviews-page">
        <div className="reviews-section">
          <h1>{title.title || title.name} User Reviews</h1>
          {filteredReviews.length === 0 ||
          filteredReviews.every((review) => review.reviewDetails === "") ? (
            <div className="no-reviews">
              No reviews yet. <br />
              <Link
                href={{
                  pathname: `/title/${id}`,
                  hash: "leave-review",
                  query: { type },
                }}
              >
                Be the first to share your thoughts on this title!
              </Link>
            </div>
          ) : (
            <>
              {filteredReviews.map((review) => (
                <Review key={review.firebaseItemId} review={review} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
