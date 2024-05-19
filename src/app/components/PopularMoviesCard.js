import React from "react";
import "../../css/PopularMoviesCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCircleInfo,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const PopularMoviesCard = () => {
  return (
    <div className="populuar-movies-card-container">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/popcorned-x.appspot.com/o/popcorned.png?alt=media&token=db91cd2d-06cd-4808-bb3b-5548b0e03762"
        alt=""
      />
      <div className="rating">
        <FontAwesomeIcon icon={faStar} />
        <p>Rate</p>
        <Link href={"/"}> Rate it</Link>
      </div>
      <h2>Movie Name</h2>
      <p className="movie-plot">
        Plot PlotPlotPlotPlot PlotPlotPlotPlot PlotPloPlot PlotPlotPlotPlot
        PlotPlotPlotPlot PlotPloPlot PlotPlotPlotPlot PlotPlotPlotPlot
        PlotPloPlot PlotPlotPlotPlot PlotPlotPlotPlot PlotPloPlot
        PlotPlotPlotPlot PlotPlotPlotPlot PlotPlotPlotPlot PlotPlotPlot
      </p>
      <button>
        Show More Info
        <FontAwesomeIcon icon={faCircleInfo} />
      </button>
      <button>
        Add to Watch List
        <FontAwesomeIcon icon={faSquarePlus} />
      </button>
    </div>
  );
};

export default PopularMoviesCard;
