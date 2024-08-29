"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function DynamicTitle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // State to hold the fetched title
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    // Split the path into segments
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1]; // Get the last segment of the path
    const secondLastSegment = pathSegments[pathSegments.length - 2]; // Get the second last segment (which might be the ID)

    // Determine if we need to fetch a title or use the folder name
    if (type && secondLastSegment && !isNaN(secondLastSegment)) {
      // Case: We're on a subpage like credits, reviews, etc.
      // The second last segment is the ID, and the last segment is the subpage
      const fetchTitle = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/${type}/${secondLastSegment}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const data = await response.json();
          const mainTitle = data.title || data.name || "Details";

          // Combine main title with the last segment if it's a subpage like 'Credits'
          const formattedLastSegment = lastSegment
            ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
            : "";

          // Set the combined title
          setPageTitle(`${mainTitle} ${formattedLastSegment}`.trim());
        } catch (error) {
          console.error("Error fetching title:", error);
          setPageTitle("Details");
        }
      };
      fetchTitle();
    } else if (type && lastSegment && !isNaN(lastSegment)) {
      // Case: We're on the main details page
      // The last segment is the ID
      const fetchTitle = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/${type}/${lastSegment}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const data = await response.json();
          const mainTitle = data.title || data.name || "Details";

          // Set the title to the main title only
          setPageTitle(mainTitle);
        } catch (error) {
          console.error("Error fetching title:", error);
          setPageTitle("Details");
        }
      };
      fetchTitle();
    } else {
      // Case: Use the last segment as the folder name
      const formattedLastSegment = lastSegment
        ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
        : "Home";
      setPageTitle(formattedLastSegment);
    }
  }, [pathname, type]);

  useEffect(() => {
    // Set the document title dynamically
    document.title = `Popcorned - ${pageTitle}`;
  }, [pageTitle]);

  return null; // This component does not render any visual elements
}
