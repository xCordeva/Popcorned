import "@/css/RatingBox.css";
import { faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { closeRatingPopup } from "@/features/RatingPopup";

const RatingBox = () => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [clickedStar, setClickedStar] = useState(0);

  const handleMouseEnter = (index) => {
    setHoveredStar(index);
  };

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  const handleRateClick = (index) => {
    setClickedStar(index);
  };

  const dispatch = useDispatch();
  return (
    <div className="rating-box-contianer">
      <div className="rating-box">
        <div className="rating-stars">
          {[...Array(10)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < (hoveredStar || clickedStar) ? faStar : faStarReg}
              onMouseEnter={() => handleMouseEnter(index + 1)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRateClick(index + 1)}
            />
          ))}
        </div>
        <p className="rating">
          <FontAwesomeIcon icon={faStar} />
          <span>{hoveredStar || clickedStar}</span>/10
        </p>
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
