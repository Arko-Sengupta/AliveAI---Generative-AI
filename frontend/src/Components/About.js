import {
  faArrowLeft,
  faBuilding,
  faFaceSmile,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { React, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SlideUp from "../Components/Animations/SlideUp";
import "../StyleSheets/About.css";
import "../StyleSheets/Home.css";
import AboutCoverImg from "../Utils/Images/About Images/About Cover Image.jpg";
import ECG from "../Utils/Images/About Images/ECG Line Image.png";
import SummaryImg from "../Utils/Images/About Images/Summary Image.jpeg";
import TickImg from "../Utils/Images/About Images/Tick Image.png";
import ECGTransparentLine from "../Utils/Images/Home Images/ECG Transparent Line.png";

// Frontend UI
// About - Cover Component
// Cover Component [Main]
const AboutCover = ({ StaticData }) => {
  const [displayedText, setDisplayedText] = useState("");
  const navigate = useNavigate();
  const { About_Cover_Title, About_Cover_Sub_Title } =
    StaticData.About.About_Cover;

  useEffect(() => {
    let index = 0; // Start from 0 to correctly display the first character
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + About_Cover_Sub_Title.charAt(index));
      index++;
      if (index === About_Cover_Sub_Title.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [About_Cover_Sub_Title]);

  return (
    <div className="about-cover-image-with-overlay">
      <img src={AboutCoverImg} alt="Cover" />
      <div className="about-cover-overlay-layer" />
      <div className="about-cover-overlay-text">
        <SlideUp>
          <h1>{About_Cover_Title}</h1>
        </SlideUp>
        <SlideUp>
          <h3>{displayedText}</h3>
        </SlideUp>
        <SlideUp>
          <div className="back-to-home" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faArrowLeft} className="left-icon" />
            <span className="back-to-home-text underline-expand">
              Back to Home
            </span>
          </div>
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
        <p className="about-summary-disabled-text">
          {About_Summary_Content_P2}
        </p>
      </SlideUp>
      <div>
        {[About_Summary_Key_1, About_Summary_Key_2, About_Summary_Key_3].map(
          (key, index) => (
            <SlideUp key={index}>
              <div className="about-summary-tick-icon-title">
                <img src={TickImg} alt="Tick Icon" />
                <span>{key}</span>
              </div>
            </SlideUp>
          )
        )}
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
            <div className="about-summary-black-overlay"></div>
          </div>
        </Row>
      </SlideUp>
    </Col>
  );
};

// About Summary [Main]
const AboutSummary = ({ StaticData }) => {
  const {
    About_Summary_Title,
    About_Summary_Content_P1,
    About_Summary_Content_P2,
    About_Summary_Key_1,
    About_Summary_Key_2,
    About_Summary_Key_3,
  } = StaticData.About.About_Summary;

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

// The counter component

const Counter = ({ StaticData }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);
  const target = 4352;
  const duration = 2000;

  const { Counter_Title } = StaticData.Counter;

  useEffect(() => {
    const handleScroll = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
        let start = 0;
        const end = target;
        const increment = end / (duration / 10);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 20);

        return () => clearInterval(timer);
      }
    };

    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.5,
    });

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasStarted, target, duration]);

  return (
    <div ref={counterRef} className="Counter-container-main">
      <SlideUp>
        <h1 className="counter-container-h1">{Counter_Title}</h1>
      </SlideUp>
      <Row className="justify-content-center py-2">
        <SlideUp>
          <img src={ECGTransparentLine} alt="ECG Line" />
        </SlideUp>
      </Row>
      <SlideUp>
        <Container className="Counter-container">
          <div className="Box">
            <FontAwesomeIcon icon={faFaceSmile} className="icon" />
            <h2>{count}</h2>
            <h3>PATIENTS</h3>
          </div>
          <div className="Box">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <h2>{count}</h2>
            <h3>SPECIALISTS</h3>
          </div>
          <div className="Box">
            <FontAwesomeIcon icon={faBuilding} className="icon" />
            <h2>{count}</h2>
            <h3>LOCATIONS</h3>
          </div>
        </Container>
      </SlideUp>
    </div>
  );
};

// About Component [Main]
const About = ({ StaticData }) => {
  return (
    <>
      <AboutCover StaticData={StaticData} />
      <AboutSummary StaticData={StaticData} />
      <Counter StaticData={StaticData} />
    </>
  );
};

export default About;
