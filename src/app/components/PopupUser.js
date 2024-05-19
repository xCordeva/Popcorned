import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { useSignOut } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faStar,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { closeUserPopup } from "@/features/UserPopup";

export default function PopupUser() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signout] = useSignOut(auth);
  const handleSignOut = async () => {
    try {
      await signout();
      dispatch(closeUserPopup(false));
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div className="popup-user">
      <h4>
        <FontAwesomeIcon icon={faStar} />
        My Ratings
      </h4>
      <h4>
        <FontAwesomeIcon icon={faList} />
        My Lists
      </h4>
      <h4 onClick={handleSignOut}>
        <FontAwesomeIcon icon={faRightToBracket} />
        Sign Out
      </h4>
    </div>
  );
}
