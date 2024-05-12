import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCaretDown,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "../../css/Navbar.css";
import PopupUser from "./PopupUser";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorned.png?alt=media&token=db91cd2d-06cd-4808-bb3b-5548b0e03762"
          alt="popcorned-logo"
        />
      </div>
      <div className="user-info">
        <div className="favorites">
          <FontAwesomeIcon icon={faHeart} />
          <p>Favourites</p>
        </div>
        <div className="user">
          <FontAwesomeIcon icon={faCircleUser} />
          <p>Cordeva</p>
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
      </div>
      <PopupUser></PopupUser>
    </div>
  );
}
