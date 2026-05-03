import "../../StyleSheets/Dashboard.css";
import StaticData from "../../Utils/StaticText.json";

const ComingSoon2 = () => {
  return (
    <div className="coming-soon-container-2">
      <div className="content">
        <h1>{StaticData.ComingSoon.ComingSoon_Title}</h1>
        <p>{StaticData.ComingSoon.ComingSoon_Description}</p>
      </div>
    </div>
  );
};

export default ComingSoon2;