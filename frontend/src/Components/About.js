import {
  faArrowLeft,
  faCalendarAlt,
  faClipboardList,
  faComments,
  faPencilAlt,
  faUserMd,
  faFaceSmile,
  faUser,
  faBuilding
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SlideUp from "../Components/Animations/SlideUp";
import "../StyleSheets/About.css";
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
    let index = -1;
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
    About_Summary_Subtitle,
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
          <SlideUp>
            <h6>{About_Summary_Subtitle}</h6>
          </SlideUp>
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

// MedicalServices component
const MedicalServices = ({ StaticData }) => {
  const services = [
    { icon: faPencilAlt, text: "Health Dashboard" },
    { icon: faClipboardList, text: "Patient Registration Data" },
    { icon: faCalendarAlt, text: "Health Check-Ups Analysis" },
    { icon: faComments, text: "Chatbot for Health Suggestions" },
    { icon: faUserMd, text: "Doctor's Appointment" }
  ];

  return (
    <div className="service-container-main">
      <div className="container">
        <SlideUp>
          <h1 className="service-container-h1">Our Services</h1>
        </SlideUp>
        <Row className="service-ecg-line justify-content-center py-2">
          <SlideUp>
            <img src={ECG} alt="ECG Line" />
          </SlideUp>
        </Row>
        <Row className="py-2">
          <SlideUp>
            <h6>Comprehensive AI-Powered Healthcare Services. Offering cutting-edge solutions for diagnostics,
              treatment planning, and patient management across all medical fields.</h6>
          </SlideUp>
        </Row>
        <SlideUp>
          <div className="medical-services-section">
            <Container>
              <Row className="mb-10">
                <Col>
                  <h3 className="services-subtitle">KEY SERVICES</h3>
                  <h2 className="services-title">
                    What medical functionality is inside?
                  </h2>
                </Col>
              </Row>
            </Container>
            <Container className="grid-three-columns">
              <Row>
                {services.map((service, index) => (
                  <Col
                    key={index}
                    xs={12}
                    md={6}
                    lg={4}
                    className="d-flex mb-4 service-item"
                  >
                    <div className="service-icon">
                      <FontAwesomeIcon icon={service.icon} className="s-icon" />
                    </div>
                    <div className="service-text">
                      <p>{service.text}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};


// Counter Component
const Counter = () => {
  const [countPatients, setCountPatients] = useState(0);
  const [countSpecialists, setCountSpecialists] = useState(0);
  const [countLocations, setCountLocations] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);

  const targetPatients = 4352;
  const targetSpecialists = 120;
  const targetLocations = 25;
  const duration = 2000;

  useEffect(() => {
    const handleScroll = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);

        const animateCount = (start, end, setCount) => {
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
        };

        animateCount(0, targetPatients, setCountPatients);
        animateCount(0, targetSpecialists, setCountSpecialists);
        animateCount(0, targetLocations, setCountLocations);
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
  }, [hasStarted, targetPatients, targetSpecialists, targetLocations, duration]);

  return (
    <div ref={counterRef} className="Counter-container-main">
      <div className="container">
        <SlideUp>
          <h1 className="counter-container-h1">Our Team</h1>
        </SlideUp>
        <Row className="justify-content-center py-2">
          <SlideUp>
            <img src={ECGTransparentLine} alt="ECG Line" />
          </SlideUp>
        </Row>
        <Row className="text-center py-2">
          <SlideUp>
            <h6>Meet the passionate innovators behind AliveAI, dedicated to transforming the future of intelligent solutions.</h6>
          </SlideUp>
        </Row>
        <SlideUp>
          <Container className="Counter-container">
            <div className="Box">
              <FontAwesomeIcon icon={faFaceSmile} className="icon" />
              <h2>{countPatients}</h2>
              <h3>PATIENTS</h3>
            </div>
            <div className="Box">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <h2>{countSpecialists}</h2>
              <h3>SPECIALISTS</h3>
            </div>
            <div className="Box">
              <FontAwesomeIcon icon={faBuilding} className="icon" />
              <h2>{countLocations}</h2>
              <h3>LOCATIONS</h3>
            </div>
          </Container>
        </SlideUp>
      </div>
    </div>
  );
};

// About Component [Main]
const About = ({ StaticData }) => {
  return (
    <>
      <AboutCover StaticData={StaticData} />
      <AboutSummary StaticData={StaticData} />
      <MedicalServices StaticData={StaticData} />
      <Counter StaticData={StaticData} />
    </>
  );
};

export default About;
