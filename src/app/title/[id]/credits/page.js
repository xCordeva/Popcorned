"use client";
import AllCast from "@/app/components/AllCast";
import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/css/AllCast.css";

export default function allCast({ params }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const id = params.id;
  console.log(id);
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState(null);
  const [titleDetails, setTitleDetails] = useState(null);

  useEffect(() => {
    if (id && type) {
      const fetchAllCast = async () => {
        try {
          const titleDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );

          const titleDetailsData = await titleDetailsResponse.json();
          setTitleDetails(titleDetailsData);

          if (type === "movie") {
            const castResponse = await fetch(
              `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            const castData = await castResponse.json();
            setCast(castData);
          } else if (type === "tv") {
            const castResponse = await fetch(
              `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
            );
            const castData = await castResponse.json();
            setCast(castData);
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllCast();
    }
  }, [id, type]);

  if (loading)
    return (
      <div className="all-cast-page-loading">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
          alt="loading-gif"
        />
        <p>Loading...</p>
      </div>
    );
  if (!cast)
    return (
      <div className="all-cast-page-not-found">
        <h1>404 Not Found!</h1>
        <p>Oops we couldn't find anything with that title...</p>
      </div>
    );
  console.log(cast);
  return (
    <div>
      <Navbar></Navbar>
      <div className="all-cast-page">
        {(type === "movie" || type === "tv") && (
          <AllCast
            id={id}
            type={type}
            cast={cast}
            title={titleDetails.title ? titleDetails.title : titleDetails.name}
          ></AllCast>
        )}
      </div>
    </div>
  );
}
