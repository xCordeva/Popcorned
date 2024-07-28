import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { useSignOut } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faStar,
  faList,
  faGear,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { closeUserPopup } from "@/features/UserPopup";
import Link from "next/link";

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
      <Link href={"/user/watchlist"} className="favorites fav-popup-user">
        <FontAwesomeIcon icon={faHeart} />
        <p>Watchlist</p>
      </Link>
      <Link href={`/profile-settings`}>
        <FontAwesomeIcon icon={faGear} />
        Profile
      </Link>
      <Link href={`/`}>
        <FontAwesomeIcon icon={faStar} />
        My Ratings
      </Link>
      <Link href={`/`}>
        <FontAwesomeIcon icon={faList} />
        My Lists
      </Link>
      <Link href={`/`} onClick={handleSignOut}>
        <FontAwesomeIcon icon={faRightToBracket} />
        Sign Out
      </Link>
    </div>
  );
}
