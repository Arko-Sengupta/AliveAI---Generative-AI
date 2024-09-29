import React from "react";
import ECGAnimation from "./ECGAnimation";
import '../../StyleSheets/DashboardMenu.css';

// Coming Soon animation for unreleased features
const ComingSoon = () => {
    return (
        <div className="coming-soon-container">
            <h1 className="coming-soon-text-large">Coming Soon</h1>
            <div><ECGAnimation/></div>
        </div>
    );
};

export default ComingSoon;