import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaAt, FaEnvelope, FaEye, FaEyeSlash, FaHome, FaPhone, FaUser, FaLock } from "react-icons/fa";

import Logo from "../Utils/Images/Logo Images/AliveAI Logo.png";
import "../StyleSheets/Dashboard.css";
import Swal from "sweetalert2";

// Replace with Country Code API
const countryCodes = [
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "India", code: "+91" },
];

// Backend Components
const handleSignUp = async (
  e,
  name,
  setName,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  countryCode,
  setCountryCode,
  mobileNumber,
  setMobileNumber,
  address,
  setAddress,
  setSignUpMessage,
  setShow,
  navigateCallback
) => {
  e.preventDefault();
  try {
    if (name === "") {
      setName("");
      setSignUpMessage("Please Enter a Valid Name");
      setShow(true);
    } else if (username === "" || handleUsernameFormat(username)) {
      setUsername("");
      setSignUpMessage("Please Enter a Valid Username");
      setShow(true);
    } else if (email === "" || handleEmailFormat(email)) {
      setEmail("");
      setSignUpMessage("Please Enter a Valid Email");
      setShow(true);
    } else if (password === "" || handlePasswordFormat(password)) {
      setPassword("");
      setSignUpMessage("Please Enter a Valid Password");
      setShow(true);
    } else if (mobileNumber === "" || mobileNumber.length < 10) {
      setMobileNumber("");
      setSignUpMessage("Please Enter a Valid Mobile Number");
      setShow(true);
    } else if (address === "") {
      setAddress("");
      setSignUpMessage("Please Enter a Valid Address");
      setShow(true);
    } else {
      const { value: otpValues } = await Swal.fire({
        title: 'Enter OTPs',
        html: `
          <input id="emailOtp" class="swal2-input" placeholder="Enter OTP sent to email" type="number">
          <input id="phoneOtp" class="swal2-input" placeholder="Enter OTP sent to phone" type="number">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Verify',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const emailOtp = Swal.getPopup().querySelector('#emailOtp').value;
          const phoneOtp = Swal.getPopup().querySelector('#phoneOtp').value;

          if (!/^\d{6}$/.test(emailOtp)) {
            Swal.showValidationMessage('Email OTP must be exactly 6 digits');
            return false;
          }
          if (!/^\d{6}$/.test(phoneOtp)) {
            Swal.showValidationMessage('Phone OTP must be exactly 6 digits');
            return false;
          }
          if (emailOtp !== '123456') {
            Swal.showValidationMessage('Incorrect OTP for email');
            return false;
          }
          if (phoneOtp !== '654321') {
            Swal.showValidationMessage('Incorrect OTP for phone');
            return false;
          }
          return { emailOtp, phoneOtp };
        }
      });

      if (otpValues) {
        // Show success message and proceed with sign-up
        Swal.fire({
          title: 'Success',
          text: 'Sign-up has been completed successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Proceed with further actions (e.g., redirect to another page)
          navigateCallback();
        });
      }
    }
  } catch (error) {
    alert("An Error Occurred.");
  }
};

const handleNameFormat = (e, setName) => {
  try {
    const name = e.target.value;
    const validInput = name.replace(/[^a-zA-Z\s]/g, "").slice(0, 30);
    setName(validInput);
  } catch (error) {
    alert("An Error Occurred.");
  }
};

const handleUsernameFormat = (Username) => {
  try {
    const usernameRegex = /^[a-z_][a-z0-9_]*$/;
    return !usernameRegex.test(Username);
  } catch (error) {
    alert("An Error Occured.");
  }
};

const handleEmailFormat = (Email) => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(Email);
  } catch (error) {
    alert("An Error Occured.");
  }
};

const handlePasswordFormat = (Password) => {
  try {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,18}$/;
    return !passwordRegex.test(Password);
  } catch (error) {
    alert("An Error Occured.");
  }
};

const handleMobileNumberFormat = (e, setMobileNumber) => {
  try {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(numericInput);
  } catch (error) {
    alert("An Error Occurred.");
  }
};

// API Calls
// const UsernameExist = () => {
//   try {
//   } catch (error) {
//     alert("An Error Occurred.");
//   }
// };

// const EmailExist = () => {
//   try {
//   } catch (error) {
//     alert("An Error Occurred.");
//   }
// };

// const MobileExist = () => {
//   try {
//   } catch (error) {
//     alert("An Error Occurred.");
//   }
// };

// UI Components
const FormAlert = ({ type, message, show, setShow }) => {
  if (show) {
    return (
      <Alert
        variant={type === "Congratulations!" ? "success" : "danger"}
        onClose={() => setShow(false)}
        dismissible
      >
        <h5>{type}</h5>
        <p>{message}</p>
      </Alert>
    );
  }
  return null;
};

const FormLogo = () => {
  return (
    <div className="form-logo-container">
      <img src={Logo} alt="" />
    </div>
  );
};

const FormConstraints = ({
  type,
  placeholder,
  value,
  onChange,
  as,
  options,
  icon,
  isPassword,
  togglePassword,
  showPassword
}) => {
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <Form.Group controlId="formName" className="my-3">
      {as === "select" ? (
        <Form.Control as="select" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              ({option.code})
            </option>
          ))}
        </Form.Control>
      ) : (
        <InputGroup>
          <InputGroup.Text>{icon}</InputGroup.Text>
          <Form.Control
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          {isPassword && (
            <InputGroup.Text onClick={togglePassword} style={{ cursor: "pointer" }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </InputGroup.Text>
          )}
        </InputGroup>
      )}
    </Form.Group>
  );
};

const SignUpButton = ({ StaticData }) => {
  return (
    <Button variant="outline-info" type="submit" className="w-100 mt-4">
      {StaticData.SignUp.SignUp_Button}
    </Button>
  );
};

const SignUpLoginNavigate = ({ StaticData, navigate }) => {
  return (
    <div className="mt-3 text-center">
      <p>
        {StaticData.SignUp.SingUp_Account_Exist}&nbsp;{" "}
        <span
          className="form-redirect-button"
          onClick={() => navigate("/login")}
        >
          {StaticData.SignUp.SignUp_Login_Redirect}
        </span>
      </p>
    </div>
  );
};

const SignUpForm = ({
  StaticData,
  name,
  setName,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  countryCode,
  setCountryCode,
  mobileNumber,
  setMobileNumber,
  address,
  setAddress,
  setSignUpMessage,
  setShow,
  navigate,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Form
        onSubmit={(e) =>
          handleSignUp(
            e,
            name,
            setName,
            username,
            setUsername,
            email,
            setEmail,
            password,
            setPassword,
            countryCode,
            setCountryCode,
            mobileNumber,
            setMobileNumber,
            address,
            setAddress,
            setSignUpMessage,
            setShow,
            navigate
          )
        }
      >
        <FormConstraints
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => handleNameFormat(e, setName)}
          icon={<FaUser />}
        />
        <FormConstraints
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<FaAt />}
        />
        <FormConstraints
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<FaEnvelope />}
        />
        <FormConstraints
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<FaLock />}
          isPassword
          togglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
        />
        <Row className="align-items-end">
          <Col xs={3} className="pr-1">
            <FormConstraints
              as="select"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              options={countryCodes}
            />
          </Col>
          <Col xs={9} className="pl-1">
            <FormConstraints
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => handleMobileNumberFormat(e, setMobileNumber)}
              icon={<FaPhone />}
            />
          </Col>
        </Row>
        <FormConstraints
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          icon={<FaHome />}
        />
        <SignUpButton StaticData={StaticData} />
        <SignUpLoginNavigate StaticData={StaticData} navigate={navigate} />
      </Form>
    </>
  );
};

const SignUp = ({  StaticData }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [signUpMessage, setSignUpMessage] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const AlertType =
    signUpMessage === "Signup information successfully submitted."
      ? "Congratulations!"
      : "Validation Error";

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center max-vh-100 bg-dark text-light"
      >
        <Row className="form-alert w-100 mx-2">
          {
            <FormAlert
              type={AlertType}
              message={signUpMessage}
              show={show}
              setShow={setShow}
            />
          }
        </Row>
      </Container>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light"
      >
        <Row className="w-100 mx-2">
          <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
            <div className="form-container">
              <FormLogo />
              <h5 className="text-center mb-5">
                {StaticData.SignUp.SignUp_Create_Account}
              </h5>
              <SignUpForm
                StaticData={StaticData}
                name={name}
                setName={setName}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                mobileNumber={mobileNumber}
                setMobileNumber={setMobileNumber}
                address={address}
                setAddress={setAddress}
                setSignUpMessage={setSignUpMessage}
                setShow={setShow}
                navigate={navigate}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUp;