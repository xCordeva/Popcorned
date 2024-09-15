import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeUserPopup } from "../features/UserPopup";
import { resetSearchResults, userSearchInput } from "@/features/UserSearch";

const usePopupCloser = ({
  setUserSearch,
  searchIconClicked,
  userSearch,
  setSearchIconClicked,
} = {}) => {
  const dispatch = useDispatch();
  const userPopupOpen = useSelector((state) => state.UserPopup.value);

  const handleBodyClick = (event) => {
    // check if the click is outside the popup
    if (
      userPopupOpen &&
      !event.target.closest(".popup-user") &&
      !event.target.closest(".user")
    ) {
      dispatch(closeUserPopup(false));
    }

    // Close the search bar if click is outside the search bar (for smaller screens)
    if (!event.target.closest(".search-bar")) {
      if (userSearch) {
        dispatch(userSearchInput(""));
        setUserSearch?.("");
        dispatch(resetSearchResults());
        if (window.innerWidth < 700 && searchIconClicked) {
          setSearchIconClicked(false);
        }
      }
    }
  };

  const handleKeyDown = (event) => {
    // Check if the pressed key is the Esc key
    if (event.key === "Escape") {
      dispatch(closeUserPopup(false));
      dispatch(userSearchInput(""));
      setUserSearch?.("");
      dispatch(resetSearchResults());
      if (window.innerWidth < 700 && searchIconClicked) {
        setSearchIconClicked(false);
      }
    }
  };

  useEffect(() => {
    if (userPopupOpen || userSearch) {
      document.body.addEventListener("click", handleBodyClick);
      document.body.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    userPopupOpen,
    userSearch,
    searchIconClicked,
    setUserSearch,
    setSearchIconClicked,
    dispatch,
  ]);
};

export default usePopupCloser;
