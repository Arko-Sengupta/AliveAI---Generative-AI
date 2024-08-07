import React from "react";
import { Row, Col, Container } from "react-bootstrap";

import AboutCoverImg from "../Utils/Images/About Images/About Cover Image.jpg";
import ECG from "../Utils/Images/About Images/ECG Line Image.png";
import SummaryImg from "../Utils/Images/About Images/Summary Image.avif";
import TickImg from "../Utils/Images/About Images/Tick Image.png";

import SlideUp from "../Components/Animations/SlideUp";
import "../StyleSheets/About.css";

// Frontend UI
// About - Cover Component
// Cover Component [Main]
const AboutCover = ({ StaticData }) => {
  const { About_Cover_Title, About_Cover_Sub_Title } = StaticData.About.About_Cover;

  return (
    <div className="about-cover-image-with-overlay">
      <img src={AboutCoverImg} alt="Cover" />
      <div className="about-cover-overlay-layer" />
      <div className="about-cover-overlay-text">
        <SlideUp>
          <h1>{About_Cover_Title}</h1>
        </SlideUp>
        <SlideUp>
          <h3>{About_Cover_Sub_Title}</h3>
        </SlideUp>
      </div>
    </div>
  );
};



// About - Summary Component
// About SummaryContentComponent
const AboutSummaryContent = ({
  About_Summary_Content_P1,
  About_Summary_Content_P2,
  About_Summary_Key_1,
  About_Summary_Key_2,
  About_Summary_Key_3,
}) => {
  return (
    <Col className="about-summary-content">
      <SlideUp>
        <p>{About_Summary_Content_P1}</p>
      </SlideUp>
      <SlideUp>
        <p className="about-summary-disabled-text">{About_Summary_Content_P2}</p>
      </SlideUp>
      <div>
        {[About_Summary_Key_1, About_Summary_Key_2, About_Summary_Key_3].map((key, index) => (
          <SlideUp key={index}>
            <div className="about-summary-tick-icon-title">
              <img src={TickImg} alt="Tick Icon" />
              <span>{key}</span>
            </div>
          </SlideUp>
        ))}
      </div>
    </Col>
  );
};

// About SummaryImageComponent
const AboutSummaryImage = () => {
  return (
    <Col>
      <SlideUp>
        <Row className="about-summary-image-row">
          <div className="about-summary-image">
            <img src={SummaryImg} alt="about-summary" />
          </div>
        </Row>
      </SlideUp>
    </Col>
  );
};

// About Summary [Main]
const AboutSummary = ({ StaticData }) => {
  const { About_Summary_Title, About_Summary_Content_P1, About_Summary_Content_P2, About_Summary_Key_1, About_Summary_Key_2, About_Summary_Key_3 } =
    StaticData.About.About_Summary;

  return (
    <div className="about-summary-container">
      <Container>
        <Row className="py-2">
          <SlideUp>
            <h1 className="about-summary-title">{About_Summary_Title}</h1>
          </SlideUp>
        </Row>
        <Row className="about-summary-ecg-line justify-content-center py-2">
          <img src={ECG} alt="ECG Line" />
        </Row>
        <Row className="py-2">
          <AboutSummaryContent
            About_Summary_Content_P1={About_Summary_Content_P1}
            About_Summary_Content_P2={About_Summary_Content_P2}
            About_Summary_Key_1={About_Summary_Key_1}
            About_Summary_Key_2={About_Summary_Key_2}
            About_Summary_Key_3={About_Summary_Key_3}
          />
          <AboutSummaryImage />
        </Row>
      </Container>
    </div>
  );
};



// About Component [Main]
const About = ({ StaticData }) => {
  return (
    <>
      <AboutCover StaticData={StaticData} />
      <AboutSummary StaticData={StaticData} />
    </>
  );
};

export default About;