import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../StyleSheets/Dashboard.css";
import Logo from "../Utils/Images/LogoImages/AliveAI Logo.png";
import { useAuth } from "./Routes/AuthContext";

const HandlePasswordFormat = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,18}$/;
  return passwordRegex.test(password);
};

const HandleLogin = async (
  e,
  navigate,
  email,
  setEmail,
  password,
  setPassword,
  setloginMessage,
  setShow,
  Login,
  StaticData
) => {
  e.preventDefault();
  try {
    const userEmail = email;
    const userPassword = password;

    if (userEmail === "" || userEmail !== StaticData.Credentials.testEmail) {
      setEmail("");
      setPassword("");
      setloginMessage(StaticData.LoginPage.LoginPage_PleaseEnterValidEmail);
      setShow(true);
    } else if (userPassword === "" || userPassword !== StaticData.Credentials.testPassword) {
      setPassword("");
      setloginMessage(StaticData.LoginPage.LoginPage_PleaseEnterValidPassword);
      setShow(true);
    } else {
      setEmail("");
      setPassword("");

      const token = StaticData.Credentials.jwtToken;

      Login(token);
      navigate("/dashboard", { state: { userEmail } });
    }
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
  controlId,
  type,
  placeholder,
  value,
  onChange,
  icon,
  isPassword,
  togglePassword,
}) => {
  const iconStyle = { color: "#1e80a3" };
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
            {type === "password" ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        )}
      </InputGroup>
    </Form.Group>
  );
};

const LoginDashboardNavigate = ({ StaticData, navigate, onForgotPassword }) => (
  <>
    <div className="pt-1 d-flex justify-content-between align-items-center">
      <div className="d-flex justify-content-between align-items-center">
        <input type="checkbox" />
        <label className="remember-me-text ms-1">{StaticData.LoginPage.LoginPage_RememberMe}</label>
      </div>
      <div>
        <span className="forgot-password-text" onClick={onForgotPassword}>
          {StaticData.Login.Login_Forgot_Password}
        </span>
      </div>
    </div>
    <Button variant="outline-info" type="submit" className="w-100 mt-4">
      {StaticData.Login.Login_Button}
    </Button>
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

const Login = ({ StaticData }) => {
  const navigate = useNavigate();
  const { Login: AuthLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setloginMessage] = useState(null);
  const [show, setShow] = useState(false);

  const AlertType =
    loginMessage === StaticData.LoginPage.LoginPage_Congratulations
      ? StaticData.LoginPage.LoginPage_Congratulations
      : StaticData.LoginPage.LoginPage_AuthFailed;

  const HandleForgotPassword = async () => {
    setEmail("");
    setPassword("");

    const { value: email } = await Swal.fire({
      title: StaticData.LoginPage.LoginPage_ForgotPassword_Title,
      html: `
        <input id="email" class="swal2-input" placeholder="${StaticData.LoginPage.LoginPage_ForgotPassword_Placeholder}" type="email">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: StaticData.LoginPage.LoginPage_Verify,
      cancelButtonText: StaticData.LoginPage.LoginPage_Cancel,
      customClass: {
        confirmButton: "btn-blue",
        cancelButton: "btn-blue",
      },
      preConfirm: () => {
        const email = Swal.getPopup().querySelector("#email").value;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
          Swal.showValidationMessage(StaticData.LoginPage.LoginPage_InvalidEmail);
          return false;
        }
        if (email !== StaticData.Credentials.testEmail) {
          Swal.showValidationMessage(StaticData.LoginPage.LoginPage_EmailNotExist);
          return false;
        }

        return { email };
      },
    });

    if (email) {
      const { value: otpValues } = await Swal.fire({
        title: StaticData.LoginPage.LoginPage_EnterOtps,
        html: `
          <input id="emailOtp" class="swal2-input" placeholder="${StaticData.LoginPage.LoginPage_OtpEmailPlaceholder}" type="number" min='0'>
          <input id="phoneOtp" class="swal2-input" placeholder="${StaticData.LoginPage.LoginPage_OtpPhonePlaceholder}" type="number" min='0'>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: StaticData.LoginPage.LoginPage_Verify,
        cancelButtonText: StaticData.LoginPage.LoginPage_Cancel,
        customClass: {
          confirmButton: "btn-blue",
          cancelButton: "btn-blue",
        },
        preConfirm: () => {
          const emailOtp = Swal.getPopup().querySelector("#emailOtp").value;
          const phoneOtp = Swal.getPopup().querySelector("#phoneOtp").value;

          if (!/^\d{6}$/.test(emailOtp)) {
            Swal.showValidationMessage(StaticData.LoginPage.LoginPage_EmailOtpDigits);
            return false;
          }
          if (!/^\d{6}$/.test(phoneOtp)) {
            Swal.showValidationMessage(StaticData.LoginPage.LoginPage_PhoneOtpDigits);
            return false;
          }
          if (emailOtp !== StaticData.Credentials.emailOtp) {
            Swal.showValidationMessage(StaticData.LoginPage.LoginPage_IncorrectEmailOtp);
            return false;
          }
          if (phoneOtp !== StaticData.Credentials.phoneOtp) {
            Swal.showValidationMessage(StaticData.LoginPage.LoginPage_IncorrectPhoneOtp);
            return false;
          }
          return { emailOtp, phoneOtp };
        },
      });

      if (otpValues) {
        const { value: formValues } = await Swal.fire({
          title: StaticData.LoginPage.LoginPage_ResetPassword,
          html: `
                    <input id="newPassword" class="swal2-input" placeholder="${StaticData.LoginPage.LoginPage_NewPassword}" type="password">
                    <input id="confirmPassword" class="swal2-input" placeholder="${StaticData.LoginPage.LoginPage_ConfirmPassword}" type="password">
                  `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: StaticData.LoginPage.LoginPage_Submit,
          cancelButtonText: StaticData.LoginPage.LoginPage_Cancel,
          customClass: {
            confirmButton: "btn-blue",
            cancelButton: "btn-blue",
          },
          preConfirm: () => {
            const newPassword =
              Swal.getPopup().querySelector("#newPassword").value;
            const confirmPassword =
              Swal.getPopup().querySelector("#confirmPassword").value;
            if (newPassword !== confirmPassword) {
              Swal.showValidationMessage(StaticData.LoginPage.LoginPage_PasswordsNoMatch);
              return false;
            }
            if (!HandlePasswordFormat(newPassword)) {
              Swal.showValidationMessage(StaticData.LoginPage.LoginPage_PasswordFormatError);
              return false;
            }
            return { newPassword };
          },
        });

        if (formValues) {
          Swal.fire({
            title: StaticData.LoginPage.LoginPage_Success,
            text: StaticData.LoginPage.LoginPage_PasswordUpdated,
            icon: "success",
            confirmButtonText: StaticData.LoginPage.LoginPage_OK,
            customClass: {
              confirmButton: "btn-blue",
            },
          });
        }
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
        <Row className="w-100 mx-2">
          <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
            <div className="form-container">
              <FormLogo />
              <h5 className="text-center mb-5">
                {StaticData.Login.Login_Signup_Account}
              </h5>
              <Form
                onSubmit={(e) =>
                  HandleLogin(
                    e,
                    navigate,
                    email,
                    setEmail,
                    password,
                    setPassword,
                    setloginMessage,
                    setShow,
                    AuthLogin,
                    StaticData
                  )
                }
              >
                <FormConstraints
                  controlId="formEmail"
                  type="email"
                  placeholder={StaticData.LoginPage.LoginPage_EnterEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FaEnvelope />}
                />
                <FormConstraints
                  controlId="formPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={StaticData.LoginPage.LoginPage_EnterPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<FaLock />}
                  isPassword
                  togglePassword={() => setShowPassword(!showPassword)}
                />
                <LoginDashboardNavigate
                  StaticData={StaticData}
                  navigate={navigate}
                  onForgotPassword={HandleForgotPassword}
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
