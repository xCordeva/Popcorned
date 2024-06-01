"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import "@/css/TitleDetails.css";
import { useSearchParams } from "next/navigation";
import TopCast from "@/app/components/TopCast";
import TitleDetails from "@/app/components/TitleDetails";

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

          if (type === "movie" || type === "tv") {
            const castResponse = await fetch(
              `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
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

  if (loading) return <p>Loading...</p>;
  if (!details) return <p>Movie not found</p>;
  console.log(details);

  return (
    <div>
      <Navbar></Navbar>
      <div className="movie-details-page">
        <TitleDetails details={details} cast={cast} type={type}></TitleDetails>
        {(type === "movie" || type === "tv") && <TopCast cast={cast}></TopCast>}
      </div>
    </div>
  );
};

export default titleDetails;
