import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { closeUserPopup } from "../features/UserPopup";
import { auth } from "@/firebase/firebase";

const usePopupCloser = () => {
  const [user] = useAuthState(auth);

  const dispatch = useDispatch();
  const userPopupOpen = useSelector((state) => state.UserPopup.value);

  const handleBodyClick = (event) => {
    // check if the click is outside the popup
    if (userPopupOpen && !event.target.closest(".popup-user")) {
      dispatch(closeUserPopup(false));
    }
  };

  const handleKeyDown = (event) => {
    // Check if the pressed key is the Esc key
    if (event.key === "Escape") {
      dispatch(closeUserPopup(false));
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick);
    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [userPopupOpen]);
};

export default usePopupCloser;
