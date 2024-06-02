"use client";
import Navbar from "@/app/components/Navbar";
import { useSelector } from "react-redux";

const SearchPage = ({ params }) => {
  const SearchResults = useSelector(
    (state) => state.UserSearch.combinedResults
  );
  const userSearch = useSelector((state) => state.UserSearch.searchInput);
  const { searchTerm } = params;
  console.log(userSearch);
  return (
    <div>
      <Navbar></Navbar>
      <div className="search-page">
        <h1>Showing results for {searchTerm}</h1>
        {SearchResults.map((result) => (
          <div className="search-result" key={result.id}>
            {result.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;

// make it only work when the user serach not when someone type in the url
