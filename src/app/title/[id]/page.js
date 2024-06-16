"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import "@/css/TitleDetails.css";
import { useSearchParams } from "next/navigation";
import TopCast from "@/app/components/TopCast";
import TitleDetails from "@/app/components/TitleDetails";
import KnownFor from "@/app/components/KnownFor";

const titleDetails = ({ params }) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState(null);

  useEffect(() => {
    if (id && type) {
      const fetchDetails = async () => {
        try {
          const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );

          const detailsData = await detailsResponse.json();
          setDetails(detailsData);

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
      fetchDetails();
    }
  }, [id, type]);

  if (loading)
    return (
      <div className="details-page-loading">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
          alt="loading-gif"
        />
        <p>Loading...</p>
      </div>
    );
  if (!details)
    return (
      <div className="details-page-not-found">
        <h1>404 Not Found!</h1>
        <p>Oops we couldn't find anything with that title...</p>
      </div>
    );

  return (
    <div>
      <Navbar></Navbar>
      <div className="title-details-page">
        <TitleDetails details={details} cast={cast} type={type}></TitleDetails>
        {(type === "movie" || type === "tv") && (
          <TopCast id={id} type={type} cast={cast}></TopCast>
        )}
        {type === "person" && (
          <KnownFor
            id={id}
            type={type}
            cast={cast}
            details={details}
          ></KnownFor>
        )}
      </div>
    </div>
  );
};

export default titleDetails;
