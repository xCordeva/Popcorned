import "@/css/SignInMessage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import {
  closeSignInMessagePopup,
  showSignInMessagePopup,
} from "@/features/SignInMessagePopup";
import useAuth from "@/Custom Hooks/useAuth";
import { useEffect } from "react";

export default function SignInMessage() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(showSignInMessagePopup(true));
    const timer = setTimeout(() => {
      dispatch(closeSignInMessagePopup(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, dispatch]);
  return (
    <div className="sign-in-box-contianer">
      <div className="sign-in-box">
        <h1>Please sign in to continue</h1>
        <FontAwesomeIcon
          icon={faXmark}
          className="x-mark"
          onClick={() => dispatch(closeSignInMessagePopup(false))}
        />
      </div>
    </div>
  );
}
