import {
  faBone,
  faBrain,
  faBuilding,
  faFaceSmile,
  faHeadSideVirus,
  faHeartbeat,
  faLungs,
  faStethoscope,
  faSyringe,
  faUser,
  faVial,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import SlideUp from "../Components/Animations/SlideUp";
import "../StyleSheets/Home.css";
import CoverImg from "../Utils/Images/Home Images/Cover Image.jpg";
import ECG from "../Utils/Images/Home Images/ECG Line Image.png";
import TransECG from "../Utils/Images/Home Images/ECG Transparent.png";
import GalleryImg_1 from "../Utils/Images/Home Images/Gallery Image 1.jpg";
import GalleryImg_2 from "../Utils/Images/Home Images/Gallery Image 2.webp";
import GalleryImg_3 from "../Utils/Images/Home Images/Gallery Image 3.jpg";
import GalleryImg_4 from "../Utils/Images/Home Images/Gallery Image 4.jpg";
import GalleryImg_5 from "../Utils/Images/Home Images/Gallery Image 5.jpg";
import GalleryImg_6 from "../Utils/Images/Home Images/Gallery Image 6.jpg";
import GalleryImg_7 from "../Utils/Images/Home Images/Gallery Image 7.jpg";
import GalleryImg_8 from "../Utils/Images/Home Images/Gallery Image 8.webp";
import Patient_1_Img from "../Utils/Images/Home Images/J.K.Rowling.jpg";
import Patient_2_Img from "../Utils/Images/Home Images/Jerry Springer.jpg";
import ReviewImg from "../Utils/Images/Home Images/Review Image.jpg";
import SummaryImg from "../Utils/Images/Home Images/Summary Image.jpeg";
import TickImg from "../Utils/Images/Home Images/Tick Image.png";

// Frontend UI
// Home - Cover Component
// Cover Component [Main]
const Cover = ({ StaticData }) => {
  const [displayedText, setDisplayedText] = useState("");
  const {
    Home_Cover_Title,
    Home_Cover_Sub_Title,
    Home_Cover_Learn_More_Button,
  } = StaticData.Home.Home_Cover;

  useEffect(() => {
    let index = -1;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + Home_Cover_Sub_Title.charAt(index));
      index++;
      if (index === Home_Cover_Sub_Title.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [Home_Cover_Sub_Title]);

  return (
    <div className="cover-image-with-overlay">
      <img src={CoverImg} alt="Cover" />
      <div className="cover-overlay-layer"></div>
      <div className="cover-overlay-text">
        <SlideUp>
          <h1>{Home_Cover_Title}</h1>
        </SlideUp>
        <SlideUp>
          <h3>{displayedText}</h3>
        </SlideUp>
        <SlideUp>
          <Button
            as={Link}
            to={"/about"}
            className="mx-2"
            variant="outline-info"
            size="md"
          >
            {Home_Cover_Learn_More_Button}
          </Button>
        </SlideUp>
      </div>
    </div>
  );
};

// Home - Department Component
// Feature Icon Grid
const FeatureIconGrid = ({ icon, title }) => (
  <div className="feature-icon-container">
    {icon}
    <h3>{title}</h3>
  </div>
);

// Features Icons Component [Main]
const FeatureIcon = () => {
  const icons = useMemo(() => {
    const iconsArray = [
      {
        icon: "Diabetes Analysis",
        image: <FontAwesomeIcon icon={faSyringe} />,
      },
      { icon: "Asthma Analysis", image: <FontAwesomeIcon icon={faLungs} /> },
      {
        icon: "Cardiovascular Analysis",
        image: <FontAwesomeIcon icon={faHeartbeat} />,
      },
      { icon: "Arthritis Analysis", image: <FontAwesomeIcon icon={faBone} /> },
      {
        icon: "Heart & Stroke Analysis",
        image: <FontAwesomeIcon icon={faStethoscope} />,
      },
      {
        icon: "Migraine Control Analysis",
        image: <FontAwesomeIcon icon={faBrain} />,
      },
      {
        icon: "Bronchitis Analysis",
        image: <FontAwesomeIcon icon={faHeadSideVirus} />,
      },
      {
        icon: "Liver Condition Analysis",
        image: <FontAwesomeIcon icon={faVial} />,
      },
    ];
    return iconsArray;
  }, []);

  return (
    <div className="feature-container">
      {[0, 1, 2, 3].map((colIndex) => (
        <Col key={colIndex} xs={4} sm={3} lg={3} className="feature-icon">
          {icons.slice(colIndex * 2, colIndex * 2 + 2).map((icon, index) => (
            <SlideUp key={index}>
              <Link to="/features">
                <FeatureIconGrid icon={icon.image} title={icon.icon} />
              </Link>
            </SlideUp>
          ))}
        </Col>
      ))}
    </div>
  );
};

// Department Component [Main]
const Departments = ({ StaticData }) => {
  const { Home_Departments_Title, Home_Departments_Sub_Title } =
    StaticData.Home.Home_Departments;

  return (
    <Container fluid className="text-center department-container">
      <Row className="py-2">
        <SlideUp>
          <h1>{Home_Departments_Title}</h1>
        </SlideUp>
      </Row>
      <Row className="justify-content-center py-2">
        <SlideUp>
          <img src={ECG} alt="ECG Line" />
        </SlideUp>
      </Row>
      <Row className="py-2">
        <SlideUp>
          <h6>{Home_Departments_Sub_Title}</h6>
        </SlideUp>
      </Row>
      <Container className="mt-5">
        <FeatureIcon />
      </Container>
    </Container>
  );
};

// Home - Summary Component
// Summary ContentComponent
const SummaryContent = ({
  Home_Summary_Content_P1,
  Home_Summary_Content_P2,
  Home_Summary_Key_1,
  Home_Summary_Key_2,
  Home_Summary_Key_3,
}) => {
  return (
    <Col className="summary-content">
      <SlideUp>
        <p>{Home_Summary_Content_P1}</p>
      </SlideUp>
      <SlideUp>
        <p className="summary-disabled-text">{Home_Summary_Content_P2}</p>
      </SlideUp>
      <div>
        {[Home_Summary_Key_1, Home_Summary_Key_2, Home_Summary_Key_3].map(
          (key, index) => (
            <SlideUp key={key}>
              <div className="summary-tick-icon-title" key={index}>
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

// Summary ImageComponent
const SummaryImage = ({ Home_Summary_Read_More_Button }) => {
  return (
    <Col>
      <SlideUp>
        <Row className="summary-image-row">
          <div className="summary-image">
            <img src={SummaryImg} alt="Summary" />
            <div className="summary-black-overlay"></div>
          </div>
        </Row>
        <Row className="mt-3 d-flex justify-content-center">
          <Button
            as={Link}
            to={"/about"}
            className="col-6 col-xs-3 col-sm-3 col-md-4 col-lg-3 col-xl-3"
            variant="outline-info"
          >
            {Home_Summary_Read_More_Button}
          </Button>
        </Row>
      </SlideUp>
    </Col>
  );
};

// Summary Component [Main]
const Summary = ({ StaticData }) => {
  const {
    Home_Summary_Title,
    Home_Summary_Content_P1,
    Home_Summary_Content_P2,
    Home_Summary_Key_1,
    Home_Summary_Key_2,
    Home_Summary_Key_3,
    Home_Summary_Read_More_Button,
  } = StaticData.Home.Home_Summary;

  return (
    <div className="summary-container">
      <Container>
        <Row className="py-2">
          <SlideUp>
            <h1 className="summary-title">{Home_Summary_Title}</h1>
          </SlideUp>
        </Row>
        <Row className="summary-ecg-line justify-content-center py-2">
          <img src={ECG} alt="ECG Line" />
        </Row>
        <Row className="py-2">
          <SummaryContent
            Home_Summary_Content_P1={Home_Summary_Content_P1}
            Home_Summary_Content_P2={Home_Summary_Content_P2}
            Home_Summary_Key_1={Home_Summary_Key_1}
            Home_Summary_Key_2={Home_Summary_Key_2}
            Home_Summary_Key_3={Home_Summary_Key_3}
          />
          <SummaryImage
            Home_Summary_Read_More_Button={Home_Summary_Read_More_Button}
          />
        </Row>
      </Container>
    </div>
  );
};

// Home - Review Component
// ReviewBlock Component
const ReviewBlock = ({ img, patient }) => (
  <Col>
    <Row className="justify-content-center pt-2">
      <div className="review-image-border">
        <img src={img} alt="" />
      </div>
    </Row>
    <Row className="pt-2">
      <h3>{patient.Home_Review_Patient_Name}</h3>
    </Row>
    <Row className="pt-2">
      <h5>{patient.Home_Review_Patient_Designation}</h5>
    </Row>
    <Row className="review-text pt-2 pb-5">
      <p>{patient.Home_Review_Patient_Review}</p>
    </Row>
  </Col>
);

// Review Component [Main]
const Review = ({ StaticData }) => {
  const {
    Home_Review_Title,
    Home_Review_Sub_Title,
    Home_Review_Patient_1,
    Home_Review_Patient_2,
  } = StaticData.Home.Home_Review;

  return (
    <div className="review-image-with-overlay">
      <div className="review-image">
        <img src={ReviewImg} alt="Overlay" />
      </div>
      <div className="review-overlay-layer"></div>
      <div className="review-overlay-text">
        <Container className="text-center review-container">
          <SlideUp>
            <Row className="py-2">
              <h1>{Home_Review_Title}</h1>
            </Row>
          </SlideUp>
          <SlideUp>
            <Row className="justify-content-center py-2">
              <img src={TransECG} alt="ECG Line" />
            </Row>
          </SlideUp>
          <SlideUp>
            <Row className="py-2">
              <h6>{Home_Review_Sub_Title}</h6>
            </Row>
          </SlideUp>
          <SlideUp>
            <Row className="review-member-image" style={{ marginTop: "10%" }}>
              <ReviewBlock
                img={Patient_1_Img}
                patient={Home_Review_Patient_1}
              />
              <ReviewBlock
                img={Patient_2_Img}
                patient={Home_Review_Patient_2}
              />
            </Row>
          </SlideUp>
        </Container>
      </div>
    </div>
  );
};

// Home - Gallery Component
// Images for Gallery
const galleryImages = [
  GalleryImg_1,
  GalleryImg_2,
  GalleryImg_3,
  GalleryImg_4,
  GalleryImg_5,
  GalleryImg_6,
  GalleryImg_7,
  GalleryImg_8,
];

// Render ImageComponent
const renderImageRow = (images) => (
  <Row>
    {images.map((src, index) => (
      <Col className="mt-2" key={index} xs={6} sm={6} md={3} lg={3}>
        <Image
          src={src}
          alt={`Gallery image ${index + 1}`}
          fluid
          className="image-hover-effect"
        />
      </Col>
    ))}
  </Row>
);

// Gallery Component [Main]
const Gallery = ({ StaticData }) => {
  const { Home_Gallery_Title, Home_Gallery_Sub_Title } =
    StaticData.Home.Home_Gallery;

  return (
    <Container fluid className="text-center gallery-container">
      <Row className="py-2">
        <SlideUp>
          <h1>{Home_Gallery_Title}</h1>
        </SlideUp>
      </Row>
      <Row className="justify-content-center py-2">
        <SlideUp>
          <Image src={ECG} alt="ECG Line" fluid />
        </SlideUp>
      </Row>
      <Row className="py-2">
        <SlideUp>
          <h6>{Home_Gallery_Sub_Title}</h6>
        </SlideUp>
      </Row>
      <Container className="gallery-images mt-5">
        <SlideUp>{renderImageRow(galleryImages.slice(0, 4))}</SlideUp>
        <SlideUp>{renderImageRow(galleryImages.slice(4))}</SlideUp>
      </Container>
    </Container>
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

// Home Component [Main]
const Home = ({ StaticData }) => {
  return (
    <div className="main">
      <Cover StaticData={StaticData} />
      <Departments StaticData={StaticData} />
      <Counter StaticData={StaticData} />
      <Summary StaticData={StaticData} />
      <Review StaticData={StaticData} />
      <Gallery StaticData={StaticData} />
    </div>
  );
};

export default Home;
