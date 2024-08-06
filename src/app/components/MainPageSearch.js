import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../css/MainPageSearch.css";
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

export default function MainPageSearch() {
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
    <div className="main-page-search">
      <div className="search-box">
        <h1>
          Welcome to&nbsp;<span style={{ color: "#ca282c" }}> Pop</span>
          <span style={{ color: "#e89c1e" }}>corned</span>!
          <img
            src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorn-gif.gif?alt=media&token=40bd37ee-6317-4211-87f2-2eca181e52e9"
            alt="popcorn-gif"
          />
        </h1>
        <h3>
          Discover a world of movies, TV shows, and people. Start Popcorning
          now.
        </h3>

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
    </div>
  );
}
