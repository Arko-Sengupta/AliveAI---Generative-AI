import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faChevronRight,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../StyleSheets/Footer.css";

const WebIconTextRow = ({ icon, text }) => (
  <Row className="align-items-center">
    <Col className="pt-1">
      <h6>
        <FontAwesomeIcon
          icon={icon}
          color="#3dd5f3"
          style={{ paddingRight: "8px" }}
          className="fa-xs"
        />
        {text}
      </h6>
    </Col>
  </Row>
);

const WebFooterContact = ({ Footer }) => (
  <Col>
    <Row className="w-footer-title text-center">
      <h1>{Footer.Footer_Col_1.Footer_Col_1_Title}</h1>
      <div className="underlineBox-1">
        <div className="underline"></div>
      </div>
    </Row>
    <Row>
      <p>{Footer.Footer_Col_1.Footer_Col_1_Description}</p>
    </Row>
    <WebIconTextRow
      icon={faLocationDot}
      text={Footer.Footer_Col_1.Footer_Col_1_Address}
    />
    <WebIconTextRow
      icon={faEnvelope}
      text={Footer.Footer_Col_1.Footer_Col_1_Mail}
    />
    <WebIconTextRow
      icon={faPhone}
      text={Footer.Footer_Col_1.Footer_Col_1_Phone}
    />
  </Col>
);

const WebFooterFeatureList = ({ Footer }) => (
  <Col className="w-footer">
    <Row className="w-footer-title text-center">
      <h1>{Footer.Footer_Col_2.Footer_Col_2_Title}</h1>
      <div className="underlineBox-2">
        <div className="underline"></div>
      </div>
    </Row>
    <Row>
      <ul>
        {Object.keys(Footer.Footer_Col_2)
          .filter((key) => key.startsWith("Footer_Col_2_Feature"))
          .map((key) => (
            <li key={key}>
              <Link className="w-footer-link" to="/features">
                <FontAwesomeIcon
                  className="fa-xs"
                  icon={faChevronRight}
                  style={{ paddingRight: "5px", color: "#3dd5f3" }}
                />
                {Footer.Footer_Col_2[key]}
              </Link>
            </li>
          ))}
      </ul>
    </Row>
  </Col>
);

const WebFooterEnquiry = ({ Footer, StaticData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const HandleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      Swal.fire({
        icon: "error",
        title: StaticData.FooterEnquiry.FooterEnquiry_EmptyFields_Title,
        text: StaticData.FooterEnquiry.FooterEnquiry_EmptyFields_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
    } else if (!EmailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: StaticData.FooterEnquiry.FooterEnquiry_InvalidEmail_Title,
        text: StaticData.FooterEnquiry.FooterEnquiry_InvalidEmail_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
    } else {
      Swal.fire({
        icon: "success",
        title: StaticData.FooterEnquiry.FooterEnquiry_MessageSent_Title,
        text: StaticData.FooterEnquiry.FooterEnquiry_MessageSent_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <Col>
      <Row className="w-footer-title text-center">
        <h1>{Footer.Footer_Col_3.Footer_Col_3_Title}</h1>
        <div className="underlineBox-3">
          <div className="underline"></div>
        </div>
      </Row>
      {[StaticData.FooterPage.FooterPage_NamePlaceholder, StaticData.FooterPage.FooterPage_EmailPlaceholder, StaticData.FooterPage.FooterPage_MessagePlaceholder].map((placeholder, index) => (
        <Row className="col-8 mt-2" key={index}>
          <Form.Control
            style={{ marginLeft: "80px" }}
            type={placeholder === StaticData.FooterPage.FooterPage_EmailPlaceholder ? "email" : "text"}
            as={placeholder === StaticData.FooterPage.FooterPage_MessagePlaceholder ? "textarea" : "input"}
            placeholder={placeholder}
            name={
              placeholder === StaticData.FooterPage.FooterPage_EmailPlaceholder
                ? "email"
                : placeholder === StaticData.FooterPage.FooterPage_NamePlaceholder
                ? "name"
                : "message"
            }
            value={
              formData[
                placeholder === StaticData.FooterPage.FooterPage_EmailPlaceholder
                  ? "email"
                  : placeholder === StaticData.FooterPage.FooterPage_NamePlaceholder
                  ? "name"
                  : "message"
              ]
            }
            onChange={HandleChange}
          />
        </Row>
      ))}
      <Row>
        <Button
          className="w-footer-form-button col-4 mt-2"
          variant="outline-info"
          onClick={HandleSubmit}
        >
          {Footer.Footer_Col_3.Footer_Col_3_Query_Form_Button}
        </Button>
      </Row>
    </Col>
  );
};

const WebFooterSocial = ({ Footer }) => {
  const socialIcons = [
    faFacebook,
    faTwitter,
    faLinkedin,
    faInstagram,
    faEnvelope,
  ];

  return (
    <>
      <Row className="w-footer-copyright">
        <h6>{Footer.Footer_Copyright.Footer_Copyright_Title}</h6>
      </Row>
      <Row className="w-footer-icons">
        {socialIcons.map((icon, index) => (
          <SocialMediaIcon key={index} icon={icon} />
        ))}
      </Row>
    </>
  );
};

const WebFooter = ({ StaticData }) => {
  const { Footer } = StaticData;
  return (
    <div className="w-footer bg-black text-light p-3">
      <Container className="mt-5 pt-5 px-3">
        <Row>
          <WebFooterContact Footer={Footer} />
          <WebFooterFeatureList Footer={Footer} />
          <WebFooterEnquiry Footer={Footer} StaticData={StaticData} />
        </Row>
        <Row className="justify-content-center">
          <hr />
        </Row>
        <WebFooterSocial Footer={Footer} />
      </Container>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <Row className="text-center">
    <h1>{title}</h1>
  </Row>
);

const MobIconTextRow = ({ icon, text }) => (
  <Row className="align-items-center mb-2">
    <Col className="pt-1">
      <h6>
        <FontAwesomeIcon
          icon={icon}
          color="#3dd5f3"
          style={{ paddingRight: "8px" }}
        />
        {text}
      </h6>
    </Col>
  </Row>
);

const MobFooterContact = ({ Footer }) => (
  <Col className="mb-5">
    <SectionHeader title={Footer.Footer_Col_1.Footer_Col_1_Title} />
    <Row>
      <p>{Footer.Footer_Col_1.Footer_Col_1_Description}</p>
    </Row>
    <MobIconTextRow
      icon={faLocationDot}
      text={Footer.Footer_Col_1.Footer_Col_1_Address}
    />
    <MobIconTextRow
      icon={faEnvelope}
      text={Footer.Footer_Col_1.Footer_Col_1_Mail}
    />
    <MobIconTextRow
      icon={faPhone}
      text={Footer.Footer_Col_1.Footer_Col_1_Phone}
    />
  </Col>
);

const MobFooterFeature = ({ Footer, featureKeys }) => (
  <Col className="mb-5">
    <SectionHeader title={Footer.Footer_Col_2.Footer_Col_2_Title} />
    <Row>
      <ul className="m-footer">
        {featureKeys.map((key) => (
          <li key={key}>
            <Link className="m-footer-link" to="/features">
              <FontAwesomeIcon
                className="fa-xs"
                icon={faChevronRight}
                style={{ paddingRight: "5px", color: "#3dd5f3" }}
              />
              {Footer.Footer_Col_2[key]}
            </Link>
          </li>
        ))}
      </ul>
    </Row>
  </Col>
);

const MobFooterEnquiry = ({ Footer, StaticData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const HandleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      Swal.fire({
        icon: "error",
        title: StaticData.FooterEnquiry.FooterEnquiry_EmptyFields_Title,
        text: StaticData.FooterEnquiry.FooterEnquiry_EmptyFields_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
    } else if (!EmailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: StaticData.FooterEnquiry.FooterEnquiry_InvalidEmail_Title,
        text: StaticData.FooterEnquiry.FooterEnquiry_InvalidEmail_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
    } else {
      Swal.fire({
        icon: "success",
        title: StaticData.FooterEnquiry.FooterEnquiry_MessageSent_Title,
        text: StaticData.FooterEnquiry.FooterEnquiry_MessageSent_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <Col>
      <SectionHeader title={Footer.Footer_Col_3.Footer_Col_3_Title} />
      <Row className="m-footer-form mt-2">
        <Form.Control
          className="mx-auto"
          type="text"
          placeholder={StaticData.FooterPage.FooterPage_NamePlaceholder}
          name="name"
          value={formData.name}
          onChange={HandleChange}
        />
      </Row>
      <Row className="m-footer-form mt-2">
        <Form.Control
          className="mx-auto"
          type="email"
          placeholder={StaticData.FooterPage.FooterPage_EmailPlaceholder}
          name="email"
          value={formData.email}
          onChange={HandleChange}
        />
      </Row>
      <Row className="m-footer-form mt-2">
        <Form.Control
          className="mx-auto"
          as="textarea"
          placeholder={StaticData.FooterPage.FooterPage_MessagePlaceholder}
          name="message"
          value={formData.message}
          onChange={HandleChange}
        />
      </Row>

      <Row className="m-footer-form-button">
        <Button className="mt-2" variant="outline-info" onClick={HandleSubmit}>
          {Footer.Footer_Col_3.Footer_Col_3_Query_Form_Button}
        </Button>
      </Row>
    </Col>
  );
};

const SocialMediaIcon = ({ icon }) => (
  <Col className="col-1 mx-1">
    <FontAwesomeIcon icon={icon} color="#3dd5f3" size="1x" />
  </Col>
);

const MobFooterSocial = ({ Footer }) => {
  const socialIcons = [
    faFacebook,
    faTwitter,
    faLinkedin,
    faInstagram,
    faEnvelope,
  ];

  return (
    <>
      <Row className="m-footer-copyright">
        <h6>{Footer.Footer_Copyright.Footer_Copyright_Title}</h6>
      </Row>
      <Row className="m-footer-icons">
        {socialIcons.map((icon, index) => (
          <SocialMediaIcon key={index} icon={icon} />
        ))}
      </Row>
    </>
  );
};

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
          <MobFooterEnquiry Footer={Footer} StaticData={StaticData} />
        </Row>
        <Row className="justify-content-center">
          <hr />
        </Row>
        <MobFooterSocial Footer={Footer} />
      </Container>
    </div>
  );
};

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

const Footer = ({ StaticData, windowWidth }) => {
  return <FooterComponent StaticData={StaticData} windowWidth={windowWidth} />;
};

export default Footer;