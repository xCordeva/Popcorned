"use client";
import Navbar from "@/app/components/Navbar";
import { useSelector } from "react-redux";

const SearchPage = ({ params }) => {
  const SearchResults = useSelector(
    (state) => state.UserSearch.combinedResults
  );
  const { searchTerm } = params;
  return (
    <div>
      <Navbar></Navbar>
      <div className="search-page">
        <h1>Showing results for {searchTerm}</h1>
        {SearchResults.map((result) => (
          <div className="search-result">{result.title}</div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
