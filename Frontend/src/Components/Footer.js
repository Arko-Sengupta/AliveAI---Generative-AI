import React, { useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../StyleSheets/Footer.css";
import { faChevronRight, faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

// Frontend UI
// WebFooter - Contact Component
// Web Footer Contact Icon Component
const WebIconTextRow = ({ icon, text }) => (
  <Row className="align-items-center">
    <Col className="pt-1">
      <h6><FontAwesomeIcon icon={icon} color="white" style={{paddingRight: "5px"}}/> {text}</h6>
    </Col>
  </Row>
);

// Web Footer Contact Component [Main]
const WebFooterContact = ({ Footer }) => {
  return (
    <Col>
      <Row className="text-center">
        <h1>{Footer.Footer_Col_1.Footer_Col_1_Title}</h1>
      </Row>
      <Row>
        <p>{Footer.Footer_Col_1.Footer_Col_1_Description}</p>
      </Row>
      <WebIconTextRow icon={faLocationDot} text={Footer.Footer_Col_1.Footer_Col_1_Address} />
      <WebIconTextRow icon={faEnvelope} text={Footer.Footer_Col_1.Footer_Col_1_Mail} />
      <WebIconTextRow icon={faPhone} text={Footer.Footer_Col_1.Footer_Col_1_Phone} />
    </Col>
  );
};



// Web Footer - Feature List Component [Main]
const WebFooterFeatureList = ({ Footer }) => {
  return (
    <Col className="w-footer">
      <Row className="text-center">
        <h1>{Footer.Footer_Col_2.Footer_Col_2_Title}</h1>
      </Row>
      <Row>
        <ul>
          {Object.keys(Footer.Footer_Col_2)
            .filter((key) => key.startsWith("Footer_Col_2_Feature"))
            .map((key) => (
              <li key={key}>
                <Link to="/features">
                  <FontAwesomeIcon icon={faChevronRight} style = {{paddingRight: "5px"}}/> {Footer.Footer_Col_2[key]}
                </Link>
              </li>
            ))}
        </ul>
      </Row>
    </Col>
  );
};



// Web Footer Enquiry Form Component [Main]
const WebFooterEnquiry = ({ Footer }) => {
  return (
    <Col>
      <Row className="text-center">
        <h1>{Footer.Footer_Col_3.Footer_Col_3_Title}</h1>
      </Row>
      {["Your Name", "Your Email", ""].map((placeholder, index) => (
        <Row className="col-8 mt-2" key={index}>
          <Form.Control
            style={{ marginLeft: "80px" }}
            type={
              placeholder
                ? placeholder === "Your Email"
                  ? "email"
                  : "text"
                : "text"
            }
            placeholder={placeholder}
          />
        </Row>
      ))}
      <Row>
        <Button
          className="w-footer-form-button col-4 mt-2"
          variant="outline-info"
        >
          {Footer.Footer_Col_3.Footer_Col_3_Query_Form_Button}
        </Button>
      </Row>
    </Col>
  );
};



// Web Footer WebFooter Social Media Strip Component [Main]
const WebFooterSocial = ({ Footer }) => {
  const socialIcons = [faFacebook, faTwitter, faLinkedin, faInstagram, faEnvelope];

  return (
    <>
      <Row className="w-footer-copyright text-center">
        <h6>{Footer.Footer_Copyright.Footer_Copyright_Title_Title}</h6>
      </Row>
      <Row className="w-footer-icons my-3">
        {socialIcons.map((icon, index) => (
          <Col className="col-1" key={index}>
            <FontAwesomeIcon icon={icon} color="white" size="1x" />
          </Col>
        ))}
      </Row>
    </>
  );
};



// Web Footer Component [Main]
const WebFooter = ({ StaticData }) => {
  const { Footer } = StaticData;
  return (
    <div className="w-footer bg-black text-light p-3">
      <Container className="mt-5 pt-5 px-3">
        <Row>
          <WebFooterContact Footer={Footer} />
          <WebFooterFeatureList Footer={Footer} />
          <WebFooterEnquiry Footer={Footer} />
        </Row>
        <Row className="justify-content-center">
          <hr />
        </Row>
        <WebFooterSocial Footer={Footer} />
      </Container>
    </div>
  );
};



// Mobile Footer - Section Headers Components [Main]
const SectionHeader = ({ title }) => (
  <Row className="text-center mb-4">
    <h1>{title}</h1>
  </Row>
);



// Mobile Footer - Contact Component
// Mobile Footer Contact Icon Component
const MobIconTextRow = ({ icon, text }) => (
  <Row className="align-items-center mb-2">
    <Col className="pt-1">
      <h6><FontAwesomeIcon icon={icon} color="white" style={{paddingRight: "5px"}}/> {text}</h6>
    </Col>
  </Row>
);

// Mobile Footer Contact Component [Main]
const MobFooterContact = ({ Footer }) => {
  return (
    <Col className="col-md-8 col-sm-12 mb-5">
      <SectionHeader title={Footer.Footer_Col_1.Footer_Col_1_Title} />
      <Row>
        <p>{Footer.Footer_Col_1.Footer_Col_1_Description}</p>
      </Row>
      <MobIconTextRow icon={faLocationDot} text={Footer.Footer_Col_1.Footer_Col_1_Address} />
      <MobIconTextRow icon={faEnvelope} text={Footer.Footer_Col_1.Footer_Col_1_Mail} />
      <MobIconTextRow icon={faPhone} text={Footer.Footer_Col_1.Footer_Col_1_Phone} />
    </Col>
  );
};



// Mobile Footer Feature List Component [Main]
const MobFooterFeature = ({ Footer, featureKeys }) => {
  return (
    <Col className="mb-5">
      <SectionHeader title={Footer.Footer_Col_2.Footer_Col_2_Title} />
      <Row>
        <ul className="m-footer">
          {featureKeys.map((key) => (
            <li key={key}>
              <Link to="/features">
                <FontAwesomeIcon icon={faChevronRight} /> {Footer.Footer_Col_2[key]}
              </Link>
            </li>
          ))}
        </ul>
      </Row>
    </Col>
  );
};



// Form Input Component
const FormInputRow = ({ placeholder, type = "text" }) => (
  <Row className="m-footer-form col-12 col-xs-8 mt-2">
    <Form.Control className="mx-auto" type={type} placeholder={placeholder} />
  </Row>
);

// Mobile Footer Enquiry Form [Main]
const MobFooterEnquiry = ({ Footer }) => {
  return (
    <Col>
      <SectionHeader title={Footer.Footer_Col_3.Footer_Col_3_Title} />
      {["Your Name", "Your Email", ""].map((placeholder, index) => (
        <FormInputRow
          key={index}
          placeholder={placeholder}
          type={placeholder === "Your Email" ? "email" : "text"}
        />
      ))}
      <Row className="m-footer-form-button">
        <Button className="col-lg-2 col-md-4 mt-2" variant="outline-info">
          {Footer.Footer_Col_3.Footer_Col_3_Query_Form_Button}
        </Button>
      </Row>
    </Col>
  );
};



// Social Media Icons Component
const SocialMediaIcon = ({ icon }) => (
  <Col className="col-1 me-2">
    <FontAwesomeIcon icon={icon} color="white" size="1x" />
  </Col>
);

// Mobile Footer Social Media Strip Component [Main]
const MobFooterSocial = ({ Footer }) => {
  const socialIcons = [faFacebook, faTwitter, faLinkedin, faInstagram, faEnvelope];

  return (
    <>
      <Row className="m-footer-copyright text-center">
        <h6>{Footer.Footer_Copyright.Footer_Copyright_Title}</h6>
      </Row>
      <Row className="m-footer-icons my-3 justify-content-center">
        {socialIcons.map((icon, index) => (
          <SocialMediaIcon key={index} icon={icon} />
        ))}
      </Row>
    </>
  );
};

// Mobile Footer [Main]
const MobileFooter = ({ StaticData }) => {
  const { Footer } = StaticData;
  const featureKeys = Object.keys(Footer.Footer_Col_2).filter((key) =>
    key.startsWith("Footer_Col_2_Feature")
  );

  return (
    <div className="m-footer bg-black text-light p-3">
      <Container className="mt-5 pt-5 px-3">
        <Row>
          <MobFooterContact Footer={Footer} />
          <MobFooterFeature Footer={Footer} featureKeys={featureKeys} />
          <MobFooterEnquiry Footer={Footer} />
        </Row>
        <Row className="justify-content-center">
          <hr />
        </Row>
        <MobFooterSocial Footer={Footer} />
      </Container>
    </div>
  );
};



// Responsive Footer Component [Main]
const FooterComponent = ({ StaticData, windowWidth }) => {
  const footer = useMemo(() => {
    return windowWidth >= 992 ? (
      <WebFooter StaticData={StaticData} />
    ) : (
      <MobileFooter StaticData={StaticData} />
    );
  }, [windowWidth, StaticData]);
  return footer;
};



// Footer Component [Main]
const Footer = ({ StaticData, windowWidth }) => {
  return <FooterComponent StaticData={StaticData} windowWidth={windowWidth} />;
};

export default Footer;