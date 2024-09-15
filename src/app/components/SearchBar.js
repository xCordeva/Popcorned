import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../css/SearchBar.css";
import "../../css/MainPageSearch.css";
import "../../css/SearchResults.css";
import { useTypewriter } from "react-simple-typewriter";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAll,
  resetSearchResults,
  userSearchInput,
} from "@/features/UserSearch";
import SearchResults from "./SearchResults";
import { useRouter } from "next/navigation";
import usePopupCloser from "@/Custom Hooks/usePopupCloser";

// Debounce function to delay the execution until user stops typing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
export default function SearchBar({ searchIconClicked, setSearchIconClicked }) {
  const [text] = useTypewriter({
    words: ["Movie...", "Tv Show...", "Person..."],
    loop: 0,
  });
  const dispatch = useDispatch();
  const [userSearch, setUserSearch] = useState("");
  usePopupCloser({
    userSearch,
    setUserSearch,
    searchIconClicked,
    setSearchIconClicked,
  });
  const status = useSelector((state) => state.UserSearch.status);
  const router = useRouter();

  const debounceHandleUserSearch = useCallback(
    debounce(() => {
      if (userSearch.trim()) {
        dispatch(resetSearchResults());
        dispatch(userSearchInput(userSearch));
        dispatch(fetchAll(userSearch));
      }
    }, 0),
    [userSearch, dispatch]
  );

  useEffect(() => {
    debounceHandleUserSearch();
  }, [userSearch, debounceHandleUserSearch]);

  const searchButtonClicked = useCallback(() => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 700) {
      // If the search bar is closed, open it on small screens
      if (!searchIconClicked) {
        setSearchIconClicked(true); // Open the search bar
      } else if (userSearch.trim()) {
        // If the search bar is open and there's user input, perform the search
        debounceHandleUserSearch();
        router.push(`/search/title/${userSearch}`);
      } else {
        setSearchIconClicked(false); // Close the search bar when no input
        setUserSearch(""); // Clear search input when closing
      }
    } else {
      // On larger screens, perform the search directly if there's input
      if (userSearch.trim()) {
        debounceHandleUserSearch();
        router.push(`/search/title/${userSearch}`);
      }
    }
  }, [
    userSearch,
    debounceHandleUserSearch,
    router,
    searchIconClicked,
    setSearchIconClicked,
  ]);

  return (
    <div className="search-bar">
      <div className="input-container">
        <input
          className={`small-screen ${
            searchIconClicked ? `search-icon-clicked` : ``
          }  `}
          type="text"
          placeholder={"Search for a " + text}
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <button onClick={searchButtonClicked}>
          <span>Search</span>
          {!searchIconClicked || userSearch ? (
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          ) : (
            <FontAwesomeIcon icon={faXmark} />
          )}
        </button>
      </div>

      {userSearch && (
        <SearchResults
          status={status}
          searchButtonClicked={searchButtonClicked}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          searchIconClicked={searchIconClicked}
          setSearchIconClicked={setSearchIconClicked}
        />
      )}
    </div>
  );
}
