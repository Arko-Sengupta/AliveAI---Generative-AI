import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav, Col, Button, Offcanvas, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faCircleInfo, faHome, faKitMedical, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "./Routes/AuthContext";

import AILogo from "../Utils/Images/Logo Images/AliveAI Logo.png";
import "../StyleSheets/Navbar.css";

// Frontend UI
// Logo Component
const Logo = () => {
  return <img src={AILogo} alt="" className="logo-container" />;
};

// Hamburger Button
const HamburgerButton = () => {
  return (
    <>
      <div className="line-lg"></div>
      <div className="line-md"></div>
      <div className="line-lg"></div>
    </>
  );
};

// WebNavbar [Main]
// WebNavbar CustomButton Component
const CustomWebButton = ({ path, label }) => (
  <Button as={Link} to={path} className="mx-2" variant="outline-info" size="md">
    {label}
  </Button>
);

// WebNavbar Component
const WebNavbar = ({ StaticData }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <Nav>
        <Nav.Link as={Link} to="/" className="me-4">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          {StaticData.Header.Header_Link_1}
        </Nav.Link>
        <Nav.Link as={Link} to="/about" className="me-4">
          <FontAwesomeIcon icon={faCircleInfo} className="me-2" />
          {StaticData.Header.Header_Link_2}
        </Nav.Link>
        <Nav.Link as={Link} to="/contact" className="me-4">
          <FontAwesomeIcon icon={faAddressBook} className="me-2" />
          {StaticData.Header.Header_Link_3}
        </Nav.Link>
        <NavDropdown title={<span><FontAwesomeIcon icon={faKitMedical} className="me-2" />{StaticData.Header.Header_Link_4}</span>} id="features-dropdown" className="me-4">
          <NavDropdown.Item as={Link} to="/features">Diabetes Analysis</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/features">Feature 2</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/features">Feature 3</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/features">Feature 4</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/features">Feature 5</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/features">Feature 6</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/features">Feature 7</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/features">Feature 8</NavDropdown.Item>
        </NavDropdown>
        {isAuthenticated && (
          <Nav.Link as={Link} to="/dashboard" className="me-4">
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Dashboard
          </Nav.Link>
        )}
      </Nav>
      <Nav>
        {isAuthenticated ? (
          <>
            <Button onClick={logout} className="mx-2" variant="outline-info" size="md">
              Logout
            </Button>
          </>
        ) : (
          <>
            <CustomWebButton path="/login" label={StaticData.Header.Header_Login_Button} />
            <CustomWebButton path="/signup" label={StaticData.Header.Header_SignUp_Button} />
          </>
        )}
      </Nav>
    </>
  );
};

// Mobile Navbar [Main]
// MobileNavbar CustomButton Component
const CustomMobButton = ({ path, label }) => {
  return (
    <Col>
      <Button
        as={Link}
        to={path}
        className="w-100 me-2"
        variant="outline-info"
        size="sm"
      >
        {label}
      </Button>
    </Col>
  );
};

// MobileNavbar Component
const MobileNavbar = ({ StaticData }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <button className="hamburger" onClick={() => setShowOffcanvas((prevState) => !prevState)}>
            <HamburgerButton />
          </button>
        </Container>
      </Navbar>
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        style={{ backgroundColor: '#212529', color: 'white' }}
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          {isAuthenticated ? (
            <Button onClick={logout} className="w-100 me-2" variant="outline-info" size="sm">
              Logout
            </Button>
          ) : (
            <Container>
              <div className="row">
                <CustomMobButton path="/login" label={StaticData.Header.Header_Login_Button} />
                <CustomMobButton path="/signup" label={StaticData.Header.Header_SignUp_Button} />
              </div>
            </Container>
          )}
          <Nav className="flex-column ms-3 mt-2">
            {isAuthenticated && (
              <Nav.Link as={Link} to="/dashboard" className="me-4">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Dashboard
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/" className="me-4">
              <FontAwesomeIcon icon={faHome} className="me-2" />
              {StaticData.Header.Header_Link_1}
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="me-4">
            <FontAwesomeIcon icon={faCircleInfo} className="me-2" />
              {StaticData.Header.Header_Link_2}
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="me-4">
            <FontAwesomeIcon icon={faAddressBook} className="me-2" />
              {StaticData.Header.Header_Link_3}
            </Nav.Link>
            <Nav.Link as={Link} to="/features" className="me-4" onClick={() => setShowDropdown((prevState) => !prevState)}>
              <FontAwesomeIcon icon={faKitMedical} className="me-2" />
              {StaticData.Header.Header_Link_4} <FontAwesomeIcon icon={faChevronDown} />
            </Nav.Link>
            {showDropdown && (
              <Nav className="flex-column ms-3 mt-2">
                <Nav.Link as={Link} to="/features" className="me-4">Diabetes Analysis</Nav.Link>
                <Nav.Link as={Link} to="/features" className="me-4">Feature 2</Nav.Link>
                <Nav.Link as={Link} to="/features" className="me-4">Feature 3</Nav.Link>
                <Nav.Link as={Link} to="/features" className="me-4">Feature 4</Nav.Link>
                <Nav.Link as={Link} to="/features" className="me-4">Feature 5</Nav.Link>
                <Nav.Link as={Link} to="/features" className="me-4">Feature 6</Nav.Link>
                <Nav.Link as={Link} to="/features" className="me-4">Feature 7</Nav.Link>
                <Nav.Link as={Link} to="/features" className="me-4">Feature 8</Nav.Link>
              </Nav>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

// Navbar [Main]
// Responsive Navbar Components as per Screen Width (992 px)
const NavbarComponent = ({ StaticData, windowWidth }) => {
  const navbar = useMemo(() => {
    return windowWidth >= 992 ? (
      <WebNavbar StaticData={StaticData} />
    ) : (
      <MobileNavbar StaticData={StaticData} />
    );
  }, [windowWidth, StaticData]);

  return navbar;
};

// Navbar Component Main
const Header = ({ StaticData, windowWidth }) => {
  return (
    <>
    <Navbar
      collapseOnSelect
      expand="lg"
        bg="dark"
        data-bs-theme="dark"
      style={{ minWidth: 250 }}
        className="shadow-lg"
    >
      <Container>
        <Navbar.Brand>
          <Logo />
        </Navbar.Brand>
        <NavbarComponent StaticData={StaticData} windowWidth={windowWidth} />
      </Container>
    </Navbar>
    </>
  );
};

export default Header;