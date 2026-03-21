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
import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import SlideUp from "./Animations/SlideUp";
import "../StyleSheets/Home.css";
import CoverImg from "../Utils/Images/HomeImages/Cover Image.jpg";
import ECG from "../Utils/Images/HomeImages/ECG Line Image.png";
import ECGTransparentLine from "../Utils/Images/HomeImages/ECG Transparent Line.png";
import TransECG from "../Utils/Images/HomeImages/ECG Transparent.png";
import GalleryImg_1 from "../Utils/Images/HomeImages/Gallery Image 1.jpg";
import GalleryImg_2 from "../Utils/Images/HomeImages/Gallery Image 2.webp";
import GalleryImg_3 from "../Utils/Images/HomeImages/Gallery Image 3.jpg";
import GalleryImg_4 from "../Utils/Images/HomeImages/Gallery Image 4.jpg";
import GalleryImg_5 from "../Utils/Images/HomeImages/Gallery Image 5.jpg";
import GalleryImg_6 from "../Utils/Images/HomeImages/Gallery Image 6.jpg";
import GalleryImg_7 from "../Utils/Images/HomeImages/Gallery Image 7.jpg";
import GalleryImg_8 from "../Utils/Images/HomeImages/Gallery Image 8.webp";
import Patient_1_Img from "../Utils/Images/HomeImages/J.K.Rowling.jpg";
import Patient_2_Img from "../Utils/Images/HomeImages/Jerry Springer.jpg";
import ReviewImg from "../Utils/Images/HomeImages/Review Image.jpg";
import SummaryImg from "../Utils/Images/HomeImages/Summary Image.jpeg";
import TickImg from "../Utils/Images/HomeImages/Tick Image.png";

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

const FeatureIconGrid = ({ icon, title }) => (
  <div className="feature-icon-container">
    {icon}
    <h3>{title}</h3>
  </div>
);

const FeatureIcon = ({ StaticData }) => {
  const icons = useMemo(() => {
    const iconsArray = [
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_1,
        image: <FontAwesomeIcon icon={faSyringe} />,
      },
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_2,
        image: <FontAwesomeIcon icon={faLungs} />,
      },
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_3,
        image: <FontAwesomeIcon icon={faHeartbeat} />,
      },
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_4,
        image: <FontAwesomeIcon icon={faBone} />,
      },
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_5,
        image: <FontAwesomeIcon icon={faStethoscope} />,
      },
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_6,
        image: <FontAwesomeIcon icon={faBrain} />,
      },
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_7,
        image: <FontAwesomeIcon icon={faHeadSideVirus} />,
      },
      {
        icon: StaticData.HomeDepartments.HomeDepartments_Icon_8,
        image: <FontAwesomeIcon icon={faVial} />,
      },
    ];
    return iconsArray;
  }, [StaticData.HomeDepartments]);

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
        <FeatureIcon StaticData={StaticData} />
      </Container>
    </Container>
  );
};

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

const Summary = ({ StaticData }) => {
  const {
    Home_Summary_Title,
    Home_Summary_Subtitle,
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
          <SlideUp>
            <h6>{Home_Summary_Subtitle}</h6>
          </SlideUp>
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

const RenderImageRow = (images, HandleImageClick) => (
  <Row>
    {images.map((src, index) => (
      <Col className="mt-2" key={index} xs={6} sm={6} md={3} lg={3}>
        <Image
          src={src}
          alt={`Gallery image ${index + 1}`}
          fluid
          className="image-hover-effect"
          onClick={() => HandleImageClick(src)}
        />
      </Col>
    ))}
  </Row>
);

const ImageModal = ({ show, src, handleClose }) => (
  <Modal show={show} onHide={handleClose} centered size="lg">
    <Modal.Body className="text-center">
      <Image src={src} alt="Large gallery image" fluid />
    </Modal.Body>
  </Modal>
);

const Gallery = ({ StaticData }) => {
  const { Home_Gallery_Title, Home_Gallery_Sub_Title } =
    StaticData.Home.Home_Gallery;

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const HandleImageClick = (src) => {
    setSelectedImage(src);
    setShowModal(true);
  };

  const HandleCloseModal = () => setShowModal(false);

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
        <SlideUp>
          {RenderImageRow(galleryImages.slice(0, 4), HandleImageClick)}
        </SlideUp>
        <SlideUp>
          {RenderImageRow(galleryImages.slice(4), HandleImageClick)}
        </SlideUp>
      </Container>
      <ImageModal
        show={showModal}
        src={selectedImage}
        handleClose={HandleCloseModal}
      />
    </Container>
  );
};

const Counter = ({ StaticData }) => {
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
    const HandleScroll = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);

        const AnimateCount = (start, end, setCount) => {
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

        AnimateCount(0, targetPatients, setCountPatients);
        AnimateCount(0, targetSpecialists, setCountSpecialists);
        AnimateCount(0, targetLocations, setCountLocations);
      }
    };

    const observer = new IntersectionObserver(HandleScroll, {
      threshold: 0.5,
    });

    const observedRef = counterRef.current;

    if (observedRef) {
      observer.observe(observedRef);
    }

    return () => {
      if (observedRef) {
        observer.unobserve(observedRef);
      }
    };
  }, [
    hasStarted,
    targetPatients,
    targetSpecialists,
    targetLocations,
    duration,
  ]);

  return (
    <div ref={counterRef} className="Counter-container-main">
      <SlideUp>
        <h1 className="counter-container-h1">{StaticData.Team.Team_Title}</h1>
      </SlideUp>
      <Row className="justify-content-center py-2">
        <SlideUp>
          <img src={ECGTransparentLine} alt="ECG Line" />
        </SlideUp>
      </Row>
      <Row className="text-center py-2">
        <SlideUp>
          <h6>
            {StaticData.Team.Team_Description}
          </h6>
        </SlideUp>
      </Row>
      <SlideUp>
        <Container className="Counter-container">
          <div className="Box">
            <FontAwesomeIcon icon={faFaceSmile} className="icon" />
            <h2>{countPatients}</h2>
            <h3>{StaticData.Team.Team_Counter_Patients}</h3>
          </div>
          <div className="Box">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <h2>{countSpecialists}</h2>
            <h3>{StaticData.Team.Team_Counter_Specialists}</h3>
          </div>
          <div className="Box">
            <FontAwesomeIcon icon={faBuilding} className="icon" />
            <h2>{countLocations}</h2>
            <h3>{StaticData.Team.Team_Counter_Locations}</h3>
          </div>
        </Container>
      </SlideUp>
    </div>
  );
};

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
