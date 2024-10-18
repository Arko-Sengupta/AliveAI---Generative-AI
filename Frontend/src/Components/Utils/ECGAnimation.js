import React, { useState, useEffect } from "react";
import "../../StyleSheets/DashboardMenu.css";

// ECG Animation component to draw an ECG heart line
const ECGAnimation = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 992);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={isMobile ? "ecg-container-mobile" : "ecg-container"}>
      <svg
        viewBox="0 0 50 50"
        height={50}
        width={50}
        className="ecg-svg"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs></defs>
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <path
            className="beat-loader"
            d="M0,25 L10,25 L15,15 L20,35 L25,5 L30,40 L35,25 L45,25"
            strokeWidth="1"
          ></path>
        </g>
      </svg>
    </div>
  );
};

export default ECGAnimation;
