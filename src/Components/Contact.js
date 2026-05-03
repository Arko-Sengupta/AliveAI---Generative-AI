import {
  faArrowLeft,
  faBuilding,
  faEnvelope,
  faFaceSmile,
  faMapMarkerAlt,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SlideUp from "./Animations/SlideUp";
import "../StyleSheets/About.css";
import "../StyleSheets/Contact.css";
import "../StyleSheets/Home.css";
import ContactCoverImg from "../Utils/Images/ContactImages/Contact Us Cover Background.jpg";
import ECGLine from "../Utils/Images/HomeImages/ECG Line Image.png";
import ECGTransparentLine from "../Utils/Images/HomeImages/ECG Transparent Line.png";

const Cover = ({ StaticData }) => {
  const [displayedText, setDisplayedText] = useState("");
  const navigate = useNavigate();
  const text = StaticData.Contact.Contact_Cover_AnimatedText;

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        return;
      }
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="contact-cover-image-with-overlay">
      <img src={ContactCoverImg} alt="Cover" />
      <div className="contact-cover-overlay-layer" />
      <div className="contact-cover-overlay-text">
        <SlideUp>
          <h1>{StaticData.Contact.Contact_Cover_Title}</h1>
        </SlideUp>
        <SlideUp>
          <h3>{displayedText}</h3>
        </SlideUp>
        <SlideUp>
          <div className="back-to-home" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faArrowLeft} className="left-icon" />
            <span className="back-to-home-text underline-expand">
              {StaticData.Contact.Contact_BackToHome}
            </span>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

const ContactCards = ({ StaticData }) => {
  const data = [
    {
      icon: <FontAwesomeIcon icon={faMapMarkerAlt} />,
      title: StaticData.Contact.Contact_Card_Location_Title,
      text: [StaticData.Contact.Contact_Card_Location_Address],
    },
    {
      icon: <FontAwesomeIcon icon={faEnvelope} />,
      title: StaticData.Contact.Contact_Card_Email_Title,
      text: [StaticData.Contact.Contact_Card_Email_Value],
    },
    {
      icon: <FontAwesomeIcon icon={faPhone} />,
      title: StaticData.Contact.Contact_Card_Phone_Title,
      text: [StaticData.Contact.Contact_Card_Phone_Value],
    },
  ];

  return (
    <div className="contact-container-main">
      <SlideUp>
        <h1 className="contact-container-main-h1">{StaticData.Contact.Contact_OurOffice}</h1>
      </SlideUp>
      <Row className="justify-content-center py-2">
        <SlideUp>
          <img src={ECGLine} alt="ECG Line" />
        </SlideUp>
      </Row>
      <Row className="text-center py-2">
        <SlideUp>
          <h6>{StaticData.Contact.Contact_OurOffice_Description}</h6>
        </SlideUp>
      </Row>
      <div className="contact-cards">
        {data.map((item, index) => (
          <SlideUp key={index}>
            <div className="card">
              <div className="contact-cards-icon">{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                {item.text.map((val, i) => (
                  <p key={i}>{val}</p>
                ))}
              </div>
            </div>
          </SlideUp>
        ))}
      </div>
    </div>
  );
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.575452,
  lng: -122.000254,
};

const Feedback = ({ StaticData }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: StaticData.Credentials.googleMapApiKey,
  });

  const mapRef = useRef(null);
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
  });

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const HandleSubmit = (e) => {
    e.preventDefault();

    const { fullName, email, description } = formData;

    if (!fullName || !email || !description) {
      Swal.fire({
        icon: "error",
        title: StaticData.Contact.Contact_Alert_EmptyFields_Title,
        text: StaticData.Contact.Contact_Alert_EmptyFields_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
    } else {
      Swal.fire({
        icon: "success",
        title: StaticData.Contact.Contact_Alert_MessageSent_Title,
        text: StaticData.Contact.Contact_Alert_MessageSent_Text,
        customClass: {
          confirmButton: "btn-blue",
        },
      });
      setFormData({ fullName: "", email: "", description: "" });
    }
  };

  return (
    <div className="feedback-container-main">
      <SlideUp>
        <h1 className="feedback-container-main-h1">{StaticData.Contact.Contact_Feedback}</h1>
      </SlideUp>
      <Row className="justify-content-center py-2">
        <SlideUp>
          <img src={ECGLine} alt="ECG Line" />
        </SlideUp>
      </Row>
      <Row className="text-center py-2">
        <SlideUp>
          <h6>{StaticData.Contact.Contact_Feedback_Description}</h6>
        </SlideUp>
      </Row>
      <SlideUp>
        <div className="feedback-form-container">
          <h1>{StaticData.Contact.Contact_Form_Title}</h1>
          <div className="underlineBox-1">
            <div className="underline"></div>
          </div>
          <div className="form-and-map">
            <div className="feedback-form">
              <form onSubmit={HandleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    id="full-name"
                    name="fullName"
                    placeholder={StaticData.Contact.Contact_Form_Name_Placeholder}
                    value={formData.fullName}
                    onChange={HandleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={StaticData.Contact.Contact_Form_Email_Placeholder}
                    value={formData.email}
                    onChange={HandleChange}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder={StaticData.Contact.Contact_Form_Description_Placeholder}
                    value={formData.description}
                    onChange={HandleChange}
                  ></textarea>
                </div>
                <button className="form-button" type="submit">
                  {StaticData.Contact.Contact_Form_Submit}
                </button>
              </form>
            </div>
            <div className="feedback-map">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={12}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  <MarkerF position={center} />
                </GoogleMap>
              ) : (
                <div>{StaticData.Contact.Contact_MapLoading}</div>
              )}
            </div>
          </div>
        </div>
      </SlideUp>
    </div>
  );
};

const Counter = ({ StaticData }) => {
  const [countPatients, setCountPatients] = useState(0);
  const [countSpecialists, setCountSpecialists] = useState(0);
  const [countLocations, setCountLocations] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);

  const targetPatients = 500;
  const targetSpecialists = 50;
  const targetLocations = 10;
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

    const currentRef = counterRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasStarted, targetPatients, targetSpecialists, targetLocations, duration]);

  return (
    <div ref={counterRef} className="Counter-container-main">
      <div className="container">
        <SlideUp>
          <h1 className="counter-container-h1">{StaticData.Contact.Contact_OurTeam}</h1>
        </SlideUp>
        <Row className="justify-content-center py-2">
          <SlideUp>
            <img src={ECGTransparentLine} alt="ECG Line" />
          </SlideUp>
        </Row>
        <Row className="text-center py-2">
          <SlideUp>
            <h6>{StaticData.Contact.Contact_OurTeam_Description}</h6>
          </SlideUp>
        </Row>
        <SlideUp>
          <Container className="Counter-container">
            <div className="Box">
              <FontAwesomeIcon icon={faFaceSmile} className="icon" />
              <h2>{countPatients}</h2>
              <h3>{StaticData.Contact.Contact_Counter_Patients}</h3>
            </div>
            <div className="Box">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <h2>{countSpecialists}</h2>
              <h3>{StaticData.Contact.Contact_Counter_Specialists}</h3>
            </div>
            <div className="Box">
              <FontAwesomeIcon icon={faBuilding} className="icon" />
              <h2>{countLocations}</h2>
              <h3>{StaticData.Contact.Contact_Counter_Locations}</h3>
            </div>
          </Container>
        </SlideUp>
      </div>
    </div>
  );
};

const Contact = ({ StaticData }) => {
  return (
    <div className="main">
      <Cover StaticData={StaticData} />
      <ContactCards StaticData={StaticData} />
      <Feedback StaticData={StaticData} />
      <Counter StaticData={StaticData} />
    </div>
  );
};

export default Contact;