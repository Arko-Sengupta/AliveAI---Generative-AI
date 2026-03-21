import React from "react";
import ECGAnimation from "./ECGAnimation";
import "../../StyleSheets/DashboardMenu.css";
import StaticData from "../../Static/StaticData.json";

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <h1 className="coming-soon-text-large">{StaticData.ComingSoon.ComingSoon_Title}</h1>
      <div><ECGAnimation /></div>
    </div>
  );
};

export default ComingSoon;
