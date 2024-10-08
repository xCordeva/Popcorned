import "../../css/MainPageSearch.css";
import SearchBar from "./SearchBar";

export default function MainPageSearch() {
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
        <SearchBar />
      </div>
    </div>
  );
}
