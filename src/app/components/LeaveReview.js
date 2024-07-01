import "@/css/LeaveReview.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function LeaveReview() {
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

  return (
    <div className="leave-review">
      <h1>Leave a Review</h1>
      <div className="review-details">
        <h2>
          Give a Rating <span>(optional)</span>
        </h2>
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
        <textarea type="text" />
        <button className="submit-button">Submit Review</button>
      </div>
    </div>
  );
}
