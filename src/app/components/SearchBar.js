import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../css/SearchBar.css";
import "../../css/MainPageSearch.css";
import "../../css/SearchResults.css";
import { useTypewriter } from "react-simple-typewriter";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSearchPopup,
  fetchAll,
  resetSearchResults,
  userSearchInput,
} from "@/features/UserSearch";
import SearchResults from "./SearchResults";
import { useRouter } from "next/navigation";

// Debounce function to delay the execution until user stops typing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
export default function SearchBar() {
  const [text] = useTypewriter({
    words: ["Movie...", "Tv Show...", "Person..."],
    loop: 0,
  });
  const dispatch = useDispatch();
  const [userSearch, setUserSearch] = useState("");
  const status = useSelector((state) => state.UserSearch.status);
  const router = useRouter();

  const debounceHandleUserSearch = useCallback(
    debounce(() => {
      if (userSearch.trim()) {
        dispatch(resetSearchResults());
        dispatch(closeSearchPopup(true));
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
    if (userSearch.trim()) {
      debounceHandleUserSearch();
      router.push(`/search/title/${userSearch}`);
    }
  }, [userSearch, debounceHandleUserSearch, router]);
  return (
    <div className="search-bar">
      <div className="input-container">
        <input
          type="text"
          placeholder={"Search for a " + text}
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <button onClick={searchButtonClicked} disabled={!userSearch}>
          <span>Search</span>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      {userSearch && (
        <SearchResults
          status={status}
          searchButtonClicked={searchButtonClicked}
          userSearch={userSearch}
        />
      )}
    </div>
  );
}
