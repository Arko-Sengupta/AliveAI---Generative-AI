import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import {
  FaAt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaHome,
  FaLock,
  FaMobile,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../StyleSheets/Dashboard.css";
import Logo from "../Utils/Images/Logo Images/AliveAI Logo.png";

// Replace with Country Code API
const countryCodes = [
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "India", code: "+91" },
];

const nameRegex = /^[a-zA-Z\s]+$/,
  usernameRegex = /^[a-z_][a-z0-9_]*$/,
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/,
  mobileRegex = /^[0-9]{10}$/;

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
    if (name === "" || !nameRegex.test(name)) {
      setName("");
      setSignUpMessage("Please Enter a Valid Name");
      setShow(true);
    } else if (username === "" || !usernameRegex.test(username)) {
      setUsername("");
      setSignUpMessage("Please Enter a Valid Username");
      setShow(true);
    } else if (email === "" || !emailRegex.test(email)) {
      setEmail("");
      setSignUpMessage("Please Enter a Valid Email");
      setShow(true);
    } else if (password === "" || !passwordRegex.test(password)) {
      setPassword("");
      setSignUpMessage("Please Enter a Valid Password");
      setShow(true);
    } else if (mobileNumber === "" || !mobileRegex.test(mobileNumber)) {
      setMobileNumber("");
      setSignUpMessage("Please Enter a Valid Mobile Number");
      setShow(true);
    } else if (address === "") {
      setAddress("");
      setSignUpMessage("Please Enter a Valid Address");
      setShow(true);
    } else {
      const { value: otpValues } = await Swal.fire({
        title: "Enter OTPs",
        html: `
          <input id="emailOtp" class="swal2-input" placeholder="Enter OTP sent to email" type="number" min='0'>
          <input id="phoneOtp" class="swal2-input" placeholder="Enter OTP sent to phone" type="number" min='0'>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Verify",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn-verify",
        },
        preConfirm: () => {
          const emailOtp = Swal.getPopup().querySelector("#emailOtp").value;
          const phoneOtp = Swal.getPopup().querySelector("#phoneOtp").value;

          if (!/^\d{6}$/.test(emailOtp)) {
            Swal.showValidationMessage("Email OTP must be exactly 6 digits");
            return false;
          }
          if (!/^\d{6}$/.test(phoneOtp)) {
            Swal.showValidationMessage("Phone OTP must be exactly 6 digits");
            return false;
          }
          if (emailOtp !== "123456") {
            Swal.showValidationMessage("Incorrect OTP for Email");
            return false;
          }
          if (phoneOtp !== "654321") {
            Swal.showValidationMessage("Incorrect OTP for Phone");
            return false;
          }
          return { emailOtp, phoneOtp };
        },
      });

      if (otpValues) {
        // Show success message and proceed with sign-up
        Swal.fire({
          title: "Success",
          text: "Sign-up has been completed successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-blue",
          },
        }).then(() => {
          // Proceed with further actions (e.g., redirect to another page)
          setName("");
          setUsername("");
          setEmail("");
          setPassword("");
          setMobileNumber("");
          setAddress("");
          navigateCallback("/login");
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

const handleMobileNumberFormat = (e, setMobileNumber) => {
  try {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(numericInput);
  } catch (error) {
    alert("An Error Occurred.");
  }
};

// UI Components

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
  showPassword,
}) => {
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const iconStyle = { color: "#1e80a3" };

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
          <InputGroup.Text style={iconStyle}>{icon}</InputGroup.Text>
          <Form.Control
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          {isPassword && (
            <InputGroup.Text
              onClick={togglePassword}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
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
              icon={<FaMobile />}
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

const SignUp = ({ StaticData }) => {
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

  show &&
    Swal.fire({
      icon: "error",
      title: AlertType,
      text: signUpMessage,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        confirmButton: "btn-blue",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setShow(false);
      }
    });

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light"
      >
        <Row className="w-100 mx-2 my-4">
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
