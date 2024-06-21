import "@/css/RatingBox.css";
import { faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeRatingPopup } from "@/features/RatingPopup";

const RatingBox = () => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const isPopupVisible = useSelector((state) => state.RatingPopup.value);

  const handleMouseEnter = (index) => {
    setHoveredStar(index);
  };

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };
  const dispatch = useDispatch();
  return (
    <div className="rating-box-contianer">
      <div className={`rating-box ${isPopupVisible ? "show" : ""}`}>
        <div className="rating-stars">
          {[...Array(10)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < hoveredStar ? faStar : faStarReg}
              onMouseEnter={() => handleMouseEnter(index + 1)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
        <div className="rating-review">
          <h3>
            Leave a Review <span>(optional)</span>
          </h3>
          <textarea type="text" />
        </div>
        <button className="rating-button">Rate</button>
        <FontAwesomeIcon
          icon={faXmark}
          className="x-mark"
          onClick={() => dispatch(closeRatingPopup(false))}
        />
      </div>
    </div>
  );
};

export default RatingBox;
