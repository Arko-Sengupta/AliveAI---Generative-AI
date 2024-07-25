import React, { useMemo } from "react";
import Card from "react-bootstrap/Card";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

import CoverImg from "../Utils/Images/Home Images/Cover Image.jpg";
import DiabetesImg from "../Utils/Images/Home Images/Daibetes Analysis.png";
import DemoIcon from "../Utils/Images/Home Images/Demo Icon.png";
import DemoMember from "../Utils/Images/Home Images/Demo Member.png";
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
import ReviewImg from "../Utils/Images/Home Images/Review Image.jpg";
import SummaryImg from "../Utils/Images/Home Images/Summary Image.avif";
import TickImg from "../Utils/Images/Home Images/Tick Image.png";

import SlideUp from "../Components/Animations/SlideUp";
import "../StyleSheets/Home.css";

// Frontend UI
// Home - Cover Component
// Cover Component [Main]
const Cover = ({ StaticData }) => {
  const { Home_Cover_Title, Home_Cover_Sub_Title, Home_Cover_Learn_More_Button } = StaticData.Home.Home_Cover;

  return (
    <div className="cover-image-with-overlay">
      <img src={CoverImg} alt="Cover" />
      <div className="cover-overlay-layer"></div>
      <div className="cover-overlay-text">
        <SlideUp>
          <h1>{Home_Cover_Title}</h1>
        </SlideUp>
        <SlideUp>
          <h3>{Home_Cover_Sub_Title}</h3>
        </SlideUp>
        <SlideUp>
          <Button className="mx-2" variant="outline-info" size="md">
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
    <img src={icon} alt={title} />
    <h3>{title}</h3>
  </div>
);

// Features Icons Component [Main]
const FeatureIcon = ({ StaticData }) => {
  const icons = useMemo(() => {
    const iconsArray = [];
    for (let i = 1; i <= 8; i++) {
      const icon = StaticData.Home.Home_Departments.Home_Departments_FeatureIcon[`Home_Departments_FeatureIcon_Icon_${i}`];
      iconsArray.push({
        icon: icon,
        image: i === 1 ? DiabetesImg : DemoIcon,
      });
    }
    return iconsArray;
  }, [StaticData]);

  return (
    <div className="feature-container">
      {[0, 1, 2, 3].map((colIndex) => (
        <Col key={colIndex} xs={3} sm={3} className="feature-icon">
          {icons.slice(colIndex * 2, colIndex * 2 + 2).map((icon, index) => (
            <SlideUp key={index}>
              <FeatureIconGrid icon={icon.image} title={icon.icon} />
            </SlideUp>
          ))}
        </Col>
      ))}
    </div>
  );
};



// Department Component [Main]
const Departments = ({ StaticData }) => {
  const { Home_Departments_Title, Home_Departments_Sub_Title } = StaticData.Home.Home_Departments;

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



// Home - Summary Component
// Summary ContentComponent
const SummaryContent = ({ Home_Summary_Content_P1, Home_Summary_Content_P2, Home_Summary_Key_1, Home_Summary_Key_2, Home_Summary_Key_3 }) => {
  return (
    <Col className="summary-content">
      <SlideUp>
        <p>{Home_Summary_Content_P1}</p>
      </SlideUp>
      <SlideUp>
        <p className="summary-disabled-text">{Home_Summary_Content_P2}</p>
      </SlideUp>
      <div>
        {[Home_Summary_Key_1, Home_Summary_Key_2, Home_Summary_Key_3].map((key, index) => (
          <SlideUp>
            <div className="summary-tick-icon-title" key={index}>
              <img src={TickImg} alt="Tick Icon" />
              <span>{key}</span>
            </div>
          </SlideUp>
        ))}
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
          </div>
        </Row>
        <Row className="mt-3 d-flex justify-content-center">
          <Button
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
          <SummaryImage Home_Summary_Read_More_Button={Home_Summary_Read_More_Button} />
        </Row>
      </Container>
    </div>
  );
};



// Home - Founders Component
// Member Component
const MemberCard = ({ Home_Founders }) => {
  const memberData = React.useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      member: Home_Founders.Home_Founders_Members[`Home_Founders_Members_Member_${i + 1}`],
      designation: Home_Founders.Home_Founders_Designations[`Home_Founders_Designations_Designation_${i + 1}`],
    }));
  }, [Home_Founders.Home_Founders_Members, Home_Founders.Home_Founders_Designations]);

  return (
    <div className="member-container">
      {memberData.map((data, index) => (
        <SlideUp key={index}>
          <Card
            bg="dark"
            data-bs-theme="dark"
            style={{
              width: "12rem",
              height: "18rem",
              WebkitBoxShadow: "0px 2px 5px rgba(0, 0, 0, 0.8)",
            }}
          >
            <Card.Img
              variant="top"
              style={{ width: "100%" }}
              src={DemoMember}
            />
            <Card.Body>
              <Card.Title style={{ fontWeight: "bold" }}>
                {data.member}
              </Card.Title>
              <Card.Text>{data.designation}</Card.Text>
            </Card.Body>
          </Card>
        </SlideUp>
      ))}
    </div>
  );
};

// Founders Component [Main]
const Founders = ({ StaticData }) => {
  const { Home_Founders_Title, Home_Founders_Sub_Title } = StaticData.Home.Home_Founders;

  return (
    <Container fluid className="text-center founders-container">
      <Row className="py-2">
        <SlideUp>
          <h1>{Home_Founders_Title}</h1>
        </SlideUp>
      </Row>
      <Row className="justify-content-center py-2">
        <SlideUp>
          <img src={ECG} alt="ECG Line" />
        </SlideUp>
      </Row>
      <Row className="py-2">
        <SlideUp>
          <h6>{Home_Founders_Sub_Title}</h6>
        </SlideUp>
      </Row>
      <Container className="mt-5 d-flex text-center">
        <MemberCard Home_Founders={StaticData.Home.Home_Founders} />
      </Container>
    </Container>
  );
};



// Home - Review Component
// ReviewBlock Component
const ReviewBlock = ({ patient }) => (
  <Col>
    <Row className="justify-content-center pt-2">
      <img src={DemoMember} alt='' />
    </Row>
    <Row className="pt-2">
      <h3>{patient.Home_Review_Patient_Name}</h3>
    </Row>
    <Row className="pt-2">
      <h5>{patient.Home_Review_Patient_Designation}</h5>
    </Row>
    <Row className="pt-2">
      <p>{patient.Home_Review_Patient_Review}</p>
    </Row>
  </Col>
);

// Review Component [Main]
const Review = ({ StaticData }) => {
  const { Home_Review_Title, Home_Review_Sub_Title, Home_Review_Patient_1, Home_Review_Patient_2 } = StaticData.Home.Home_Review;

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
              <ReviewBlock patient={Home_Review_Patient_1} />
              <ReviewBlock patient={Home_Review_Patient_2} />
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
        <Image src={src} alt={`Gallery image ${index + 1}`} fluid />
      </Col>
    ))}
  </Row>
);

// Gallery Component [Main]
const Gallery = ({ StaticData }) => {
  const { Home_Gallery_Title, Home_Gallery_Sub_Title } = StaticData.Home.Home_Gallery;
  
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



// Home Component [Main]
const Home = ({ StaticData }) => {
  return (
    <>
      <Cover StaticData={StaticData} />
      <Departments StaticData={StaticData} />
      <Summary StaticData={StaticData} />
      <Founders StaticData={StaticData} />
      <Review StaticData={StaticData} />
      <Gallery StaticData={StaticData} />
    </>
  );
};

export default Home;