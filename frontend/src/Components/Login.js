import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../StyleSheets/Dashboard.css";
import Logo from "../Utils/Images/Logo Images/AliveAI Logo.png";
import { useAuth } from "./Routes/AuthContext";

// Password format validation function
const handlePasswordFormat = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,18}$/;
  return passwordRegex.test(password);
};

const handleLogin = async (
  e,
  navigate,
  email,
  setEmail,
  password,
  setPassword,
  setloginMessage,
  setShow,
  login // This function comes from useAuth()
) => {
  e.preventDefault();
  try {
    const userEmail = email;
    const userPassword = password;

    // Temporary Email & Password for Test
    if (userEmail === "" || userEmail !== "arkosengupta9@gmail.com") {
      setEmail("");
      setloginMessage("Please Enter valid email");
      setShow(true);
    } else if (userPassword === "" || userPassword !== "Arko@1234") {
      setPassword("");
      setloginMessage("Please Enter valid password");
      setShow(true);
    } else {
      setEmail("");
      setPassword("");

      // Replace "web_token" with your actual JWT token
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjEwNzU4MjI2LCJleHAiOjE2MTA3NjE4MjZ9.02F2ZuK3GOl9BptxIjJh1AZLa_Eklj4P9hZjCv7uPVU";

      // Use the login function from useAuth() to set the token
      login(token);
      navigate("/dashboard", { state: { userEmail } });
    }
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
  controlId,
  type,
  placeholder,
  value,
  onChange,
  icon,
  isPassword,
  togglePassword,
}) => {
  const iconStyle = { color: "#009ab8" };
  return (
    <Form.Group controlId={controlId} className="mt-4">
      <InputGroup>
        <InputGroup.Text style={iconStyle}>{icon}</InputGroup.Text>
        <Form.Control
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <InputGroup.Text
            onClick={togglePassword}
            style={{ cursor: "pointer" }}
          >
            {type === "password" ? <FaEye /> : <FaEyeSlash />}
          </InputGroup.Text>
        )}
      </InputGroup>
    </Form.Group>
  );
};

const LoginButton = ({ StaticData }) => {
  return (
    <Button variant="outline-info" type="submit" className="w-100 mt-4">
      {StaticData.Login.Login_Button}
    </Button>
  );
};

const LoginDashboardNavigate = ({ StaticData, navigate, onForgotPassword }) => {
  return (
    <>
      <div className="pt-1 d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between align-items-center">
          <input type="checkbox" />
          <label className="remember-me-text ms-1">Remember Me</label>
        </div>
        <div>
          <span className="forgot-password-text" onClick={onForgotPassword}>
            {StaticData.Login.Login_Forgot_Password}
          </span>
        </div>
      </div>
      <LoginButton StaticData={StaticData} />
      <div className="mt-3 text-center">
        <p>
          {StaticData.Login.Login_Account_Exists}&nbsp;
          <span
            className="form-redirect-button"
            onClick={() => navigate("/signup")}
          >
            {StaticData.Login.Login_Signup}
          </span>
        </p>
      </div>
    </>
  );
};

const Login = ({ StaticData }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setloginMessage] = useState(null);
  const [show, setShow] = useState(false);

  const AlertType =
    loginMessage === "Logging into your Account."
      ? "Congratulations!"
      : "Authentication Failed";

  const handleForgotPassword = async () => {
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
          Swal.showValidationMessage("Incorrect OTP for email");
          return false;
        }
        if (phoneOtp !== "654321") {
          Swal.showValidationMessage("Incorrect OTP for phone");
          return false;
        }
        return { emailOtp, phoneOtp };
      },
    });

    if (otpValues) {
      // Step 1: Show popup to enter new password and confirm password
      const { value: formValues } = await Swal.fire({
        title: "Reset Password",
        html: `
                  <input id="newPassword" class="swal2-input" placeholder="New Password" type="password">
                  <input id="confirmPassword" class="swal2-input" placeholder="Confirm Password" type="password">
                `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn-blue",
        },
        preConfirm: () => {
          const newPassword =
            Swal.getPopup().querySelector("#newPassword").value;
          const confirmPassword =
            Swal.getPopup().querySelector("#confirmPassword").value;
          if (newPassword !== confirmPassword) {
            Swal.showValidationMessage("Passwords do not match");
            return false;
          }
          if (!handlePasswordFormat(newPassword)) {
            Swal.showValidationMessage(
              "Password must be between 8 and 18 characters and include uppercase, lowercase, numeric, and special characters"
            );
            return false;
          }
          return { newPassword };
        },
      });

      if (formValues) {
        Swal.fire({
          title: "Success",
          text: "Password has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-blue",
          },
        });
      }
    }
  };

  show &&
    Swal.fire({
      icon: "error",
      title: AlertType,
      text: loginMessage,
      allowOutsideClick: false,
      allowEscapeKey: false,
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
        <Row className="w-100 mx-2">
          <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
            <div className="form-container">
              <FormLogo />
              <h5 className="text-center mb-5">
                {StaticData.Login.Login_Signup_Account}
              </h5>
              <Form
                onSubmit={(e) =>
                  handleLogin(
                    e,
                    navigate,
                    email,
                    setEmail,
                    password,
                    setPassword,
                    setloginMessage,
                    setShow,
                    login
                  )
                }
              >
                <FormConstraints
                  controlId="formEmail"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FaEnvelope />}
                />
                <FormConstraints
                  controlId="formPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={"Enter Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<FaLock />}
                  isPassword
                  togglePassword={() => setShowPassword(!showPassword)}
                />
                <LoginDashboardNavigate
                  StaticData={StaticData}
                  navigate={navigate}
                  onForgotPassword={handleForgotPassword}
                />
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
