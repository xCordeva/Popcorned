import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCaretDown,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "../../css/Navbar.css";
import "../../css/SearchBar.css";
import PopupUser from "./PopupUser";
import { useDispatch, useSelector } from "react-redux";
import { openUserPopup } from "@/features/UserPopup";
import useAuth from "@/Custom Hooks/useAuth";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  let noSearchBar = true;
  if (pathname === "/") {
    noSearchBar = false;
  }
  const dispatch = useDispatch();
  const userPopupClicked = useSelector((state) => state.UserPopup.value);
  const toggleUserPopup = () => {
    dispatch(openUserPopup(!userPopupClicked));
  };
  const { user, loading } = useAuth();
  const [searchIconClicked, setSearchIconClicked] = useState(false);

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div
          className={`nav-logo ${
            searchIconClicked ? `search-icon-clicked` : ``
          }  `}
        >
          <Link href={"/"}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorned.png?alt=media&token=db91cd2d-06cd-4808-bb3b-5548b0e03762"
              alt="popcorned-logo"
            />
          </Link>
        </div>
        <div
          className={`nav-search-bar ${
            searchIconClicked ? `full-width` : ``
          }  `}
        >
          {noSearchBar && (
            <SearchBar
              setSearchIconClicked={setSearchIconClicked}
              searchIconClicked={searchIconClicked}
            />
          )}
        </div>
        <div
          className={`user-info ${
            searchIconClicked ? `search-icon-clicked` : ``
          }  `}
        >
          <Link href={"/user/watchlist"} className="favorites fav-navbar">
            <FontAwesomeIcon icon={faHeart} />
            <p>Watchlist</p>
          </Link>
          {loading ? (
            <div className="user">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/loading.gif?alt=media&token=fb93d855-3412-4e08-bf85-a696cc68004a"
                alt="loading-gif"
              />
            </div>
          ) : user ? (
            <div
              className={userPopupClicked ? "user user-backgrounded" : "user"}
              onClick={() => {
                toggleUserPopup();
              }}
            >
              {user?.photoURL ? (
                <img src={user?.photoURL} alt="user-photo" />
              ) : (
                <FontAwesomeIcon icon={faCircleUser} />
              )}
              <p>{user.displayName && user.displayName.split(" ")[0]}</p>
              <FontAwesomeIcon
                className={
                  userPopupClicked ? "user-arrow-up" : "user-arrow-down"
                }
                icon={faCaretDown}
              />
            </div>
          ) : (
            <div
              className={`sign-in-button ${
                searchIconClicked ? `search-icon-clicked` : ``
              }  `}
            >
              <Link href="/sign-in">Sign In</Link>
            </div>
          )}
        </div>
        {userPopupClicked && <PopupUser></PopupUser>}
      </div>
    </div>
  );
}
