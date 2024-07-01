import "@/css/UserReviews.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function UserReviews() {
  return (
    <div className="user-reviews">
      <h1>User Reviews</h1>
      <div className="reviews">
        <div className="review">
          <img
            src="https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
            alt=""
          />
          <div className="username-date-time">
            <div className="username-rate">
              <div className="username-date">
                <p className="username">Cordeva</p>
                <p className="date-time">2024-6-2</p>
              </div>
              <div className="rating">
                <FontAwesomeIcon icon={faStar} />
                <p>
                  6<span>/10</span>
                </p>
              </div>
            </div>
            <p className="review-details">bla</p>
          </div>
        </div>
        <div className="review">
          <img
            src="https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
            alt=""
          />
          <div className="username-date-time">
            <div className="username-rate">
              <div className="username-date">
                <p className="username">Cordeva</p>
                <p className="date-time">2024-6-2</p>
              </div>
              <div className="rating">
                <FontAwesomeIcon icon={faStar} />
                <p>
                  6<span>/10</span>
                </p>
              </div>
            </div>
            <p className="review-details">
              bla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              bla
            </p>
          </div>
        </div>
        <div className="review">
          <img
            src="https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
            alt=""
          />
          <div className="username-date-time">
            <div className="username-rate">
              <div className="username-date">
                <p className="username">Cordeva</p>
                <p className="date-time">2024-6-2</p>
              </div>
              <div className="rating">
                <FontAwesomeIcon icon={faStar} />
                <p>
                  6<span>/10</span>
                </p>
              </div>
            </div>
            <p className="review-details">
              bla bla blabla bla blabla bla blabla bla blabla bla blabla bla
              blabla bla blabla bla blabla bla bla
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
