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
import Logo from "../Utils/Images/LogoImages/AliveAI Logo.png";

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

const HandleSignUp = async (
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
  navigateCallback,
  StaticData
) => {
  e.preventDefault();
  try {
    if (name === "" || !nameRegex.test(name)) {
      setName("");
      setSignUpMessage(StaticData.SignUpPage.SignUpPage_Err_InvalidName);
      setShow(true);
    } else if (username === "" || !usernameRegex.test(username)) {
      setUsername("");
      setSignUpMessage(StaticData.SignUpPage.SignUpPage_Err_InvalidUsername);
      setShow(true);
    } else if (email === "" || !emailRegex.test(email)) {
      setEmail("");
      setSignUpMessage(StaticData.SignUpPage.SignUpPage_Err_InvalidEmail);
      setShow(true);
    } else if (password === "" || !passwordRegex.test(password)) {
      setPassword("");
      setSignUpMessage(StaticData.SignUpPage.SignUpPage_Err_InvalidPassword);
      setShow(true);
    } else if (mobileNumber === "" || !mobileRegex.test(mobileNumber)) {
      setMobileNumber("");
      setSignUpMessage(StaticData.SignUpPage.SignUpPage_Err_InvalidMobile);
      setShow(true);
    } else if (address === "") {
      setAddress("");
      setSignUpMessage(StaticData.SignUpPage.SignUpPage_Err_InvalidAddress);
      setShow(true);
    } else {
      const { value: otpValues } = await Swal.fire({
        title: StaticData.SignUpPage.SignUpPage_EnterOtps,
        html: `
          <input id="emailOtp" class="swal2-input" placeholder="${StaticData.SignUpPage.SignUpPage_OtpEmailPlaceholder}" type="number" min='0'>
          <input id="phoneOtp" class="swal2-input" placeholder="${StaticData.SignUpPage.SignUpPage_OtpPhonePlaceholder}" type="number" min='0'>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: StaticData.SignUpPage.SignUpPage_Verify,
        cancelButtonText: StaticData.SignUpPage.SignUpPage_Cancel,
        customClass: {
          confirmButton: "btn-blue",
          cancelButton: "btn-blue",
        },
        preConfirm: () => {
          const emailOtp = Swal.getPopup().querySelector("#emailOtp").value;
          const phoneOtp = Swal.getPopup().querySelector("#phoneOtp").value;

          if (!/^\d{6}$/.test(emailOtp)) {
            Swal.showValidationMessage(StaticData.SignUpPage.SignUpPage_EmailOtpDigits);
            return false;
          }
          if (!/^\d{6}$/.test(phoneOtp)) {
            Swal.showValidationMessage(StaticData.SignUpPage.SignUpPage_PhoneOtpDigits);
            return false;
          }
          if (emailOtp !== StaticData.Credentials.emailOtp) {
            Swal.showValidationMessage(StaticData.SignUpPage.SignUpPage_IncorrectEmailOtp);
            return false;
          }
          if (phoneOtp !== StaticData.Credentials.phoneOtp) {
            Swal.showValidationMessage(StaticData.SignUpPage.SignUpPage_IncorrectPhoneOtp);
            return false;
          }
          return { emailOtp, phoneOtp };
        },
      });

      if (otpValues) {
        Swal.fire({
          title: StaticData.SignUpPage.SignUpPage_Success,
          text: StaticData.SignUpPage.SignUpPage_SignupComplete,
          icon: "success",
          confirmButtonText: StaticData.SignUpPage.SignUpPage_OK,
          customClass: {
            confirmButton: "btn-blue",
          },
        }).then(() => {
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

const HandleNameFormat = (e, setName) => {
  try {
    const name = e.target.value;
    const validInput = name.replace(/[^a-zA-Z\s]/g, "").slice(0, 30);
    setName(validInput);
  } catch (error) {
    alert("An Error Occurred.");
  }
};

const HandleMobileNumberFormat = (e, setMobileNumber) => {
  try {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(numericInput);
  } catch (error) {
    alert("An Error Occurred.");
  }
};

const FormLogo = () => (
  <div className="form-logo-container">
    <img src={Logo} alt="" />
  </div>
);

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

const SignUpButton = ({ StaticData }) => (
  <Button variant="outline-info" type="submit" className="w-100 mt-4">
    {StaticData.SignUp.SignUp_Button}
  </Button>
);

const SignUpLoginNavigate = ({ StaticData, navigate }) => (
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
          HandleSignUp(
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
            navigate,
            StaticData
          )
        }
      >
        <FormConstraints
          type="text"
          placeholder={StaticData.SignUpPage.SignUpPage_FullName}
          value={name}
          onChange={(e) => HandleNameFormat(e, setName)}
          icon={<FaUser />}
        />
        <FormConstraints
          type="text"
          placeholder={StaticData.SignUpPage.SignUpPage_Username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<FaAt />}
        />
        <FormConstraints
          type="email"
          placeholder={StaticData.SignUpPage.SignUpPage_Email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<FaEnvelope />}
        />
        <FormConstraints
          type="password"
          placeholder={StaticData.SignUpPage.SignUpPage_Password}
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
              placeholder={StaticData.SignUpPage.SignUpPage_MobileNumber}
              value={mobileNumber}
              onChange={(e) => HandleMobileNumberFormat(e, setMobileNumber)}
              icon={<FaMobile />}
            />
          </Col>
        </Row>
        <FormConstraints
          type="text"
          placeholder={StaticData.SignUpPage.SignUpPage_Address}
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
    signUpMessage === StaticData.SignUpPage.SignUpPage_SignupComplete
      ? StaticData.LoginPage.LoginPage_Congratulations
      : StaticData.SignUpPage.SignUpPage_ValidationError;

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
