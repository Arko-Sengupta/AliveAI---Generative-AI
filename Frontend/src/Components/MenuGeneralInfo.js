import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import CustomButton from "./Utils/CustomButton";
import '../StyleSheets/DashboardMenu.css';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Modal
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faAt,
  faEnvelope,
  faLock,
  faPhone,
  faHouse,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

const FormGroup = ({
  label,
  type,
  value,
  name,
  icon,
  readOnly,
  editField,
  handleChange,
  handleEdit,
  error,
  additionalContent,
  labelIcon,
  onLabelIconClick
}) => (
  <Form.Group as={Row} className="mb-3">
    <Form.Label column sm="3" className="info-label">
      {label}
      {labelIcon && (
        <FontAwesomeIcon
          icon={labelIcon}
          style={{ marginLeft: '8px', cursor: 'pointer' }}
          onClick={onLabelIconClick}
        />
      )}
    </Form.Label>
    <Col sm="8">
      <InputGroup className={editField === name ? "editable-field" : ""}>
        <InputGroup.Text>
          <FontAwesomeIcon icon={icon} style={{ paddingRight: "6px" }} />
        </InputGroup.Text>
        <Form.Control
          type={type}
          value={value}
          readOnly={readOnly}
          name={name}
          onChange={handleChange}
        />
      </InputGroup>
      {error && <div className="error-text">{error}</div>}
      {additionalContent}
    </Col>
    <Col sm="1">
      <Button variant="link" onClick={() => handleEdit(name)}>
        <FontAwesomeIcon icon={faEdit} />
      </Button>
    </Col>
  </Form.Group>
);

const FormModal = ({
  showModal,
  closeModal,
  title,
  inputType,
  inputValue,
  inputPlaceholder,
  inputOnChange,
  handleSubmit,
  submitDisabled
}) => (
  <Modal show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Control
        type={inputType}
        value={inputValue}
        onChange={inputOnChange}
        placeholder={inputPlaceholder}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={closeModal}>
        Cancel
      </Button>
      <CustomButton
        textColor="white"
        bgColor="#1D9BCE"
        hoverColor="#3DD5F3"
        onClick={handleSubmit}
        disabled={submitDisabled}
      >
        Verify
      </CustomButton>
    </Modal.Footer>
  </Modal>
);

const MenuGeneralInfo = () => {
  // TODO: Set this to "" once API is integrated
  const [formData, setFormData] = useState({
    fullName: "Arko Sengupta",
    username: "arkosengupta",
    email: "arko.sengupta@example.com",
    password: "Password123*",
    countryCode: "+91",
    phoneNumber: "1234567890",
    address: "1234 Delhi, India",
  });

  const [editField, setEditField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [changesMade, setChangesMade] = useState({});
  const [errors, setErrors] = useState({});

  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [verificationStatus, setVerificationStatus] = useState({emailVerified: false, phoneVerified: false});

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const countryCodes = [
    { label: "+91 - India", value: "+91" },
    { label: "+1 - USA", value: "+1" },
    { label: "+44 - UK", value: "+44" },
  ];

  // Form validation
  const validateForm = useCallback(() => {
    let errors = {};
    if (!validateName(formData.fullName)) {
      errors.fullName = "Name should contain only letters and spaces.";
    }
    if (!validateUsername(formData.username)) {
      errors.username = "Username should start with a letter or underscore, and contain only lowercase letters, numbers, and underscores.";
    }
    if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format.";
    }
    if (!validatePassword(formData.password)) {
      errors.password = "Password should be 8-18 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number should be 10 digits long.";
    }
    return errors;
  }, [formData]);

  const validateName = (name) => {
    return /^[a-zA-Z\s]*$/.test(name) && name.length <= 30;
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-z_][a-z0-9_]*$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,18}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const numericPhone = phoneNumber.replace(/\D/g, "");
    return numericPhone.length === 10;
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [formData, validateForm]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // On clicking Save button
  const handleSave = () => {
    if (Object.keys(changesMade).length > 0) {
      // If email/password is edited, they first need to be verified
      const emailVerificationRequired = changesMade.email && !verificationStatus.emailVerified;
      const phoneVerificationRequired = changesMade.phoneNumber && !verificationStatus.phoneVerified;
  
      // If not verified, throw an error
      if (emailVerificationRequired || phoneVerificationRequired) {
        Swal.fire({
          icon: "error",
          title: "Verification Required",
          text: "Please verify your email and/or phone number before saving.",
          timer: 4000,
          showConfirmButton: false,
        });
        return;
      }
  
      // Else save
      setSaved(true);
      setEditField(null);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
  
      let successMessage = "Your changes have been saved.";
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: successMessage,
        timer: 4000,
        showConfirmButton: false,
      });
    }
  };
  
  // On clicking Edit button
  const handleEdit = (field) => {
    // If password is edited, open password form
    if (field === "password") {
      setShowPasswordModal(true);
    } else {
      setEditField(field);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setChangesMade({ ...changesMade, [name]: value });
  };

  // Password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  // Password form saved
  const handlePasswordSave = () => {
    let errors = {};
    // Check if current password matches
    if (passwordForm.currentPassword !== formData.password) {
      errors.currentPassword = "Current password is incorrect.";
    }
    // New password should adhere to password rules
    if (!validatePassword(passwordForm.newPassword)) {
      errors.newPassword =
        "Password should be 8-18 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    // New password should be equal to confirm password field
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "New password and confirm password do not match.";
    }
    // Throw an error if the above conditions are not validated
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    // Else save
    setFormData({ ...formData, password: passwordForm.newPassword });
    setChangesMade({ ...changesMade, password: passwordForm.newPassword });
    setShowPasswordModal(false);
    Swal.fire({
      icon: "success",
      title: "Password Changed!",
      text: "Your password has been changed successfully.",
      timer: 4000,
      showConfirmButton: false,
    });
  };

  // Verify email
  const handleVerifyEmail = () => {
    const staticOtp = "123456"; // temp OTP for test
    // TODO:- static OTP should be replaced when backend is integrated
    // Check if OTP sent matches with entered OTP
    if (otpEmail === staticOtp) {
      setVerificationStatus({ ...verificationStatus, emailVerified: true });
      setChangesMade({ ...changesMade, email: formData.email });
      setShowEmailModal(false);
      Swal.fire({
        icon: "success",
        title: "Email Verified!",
        text: "Your email has been verified successfully.",
        timer: 4000,
        showConfirmButton: false,
      });
    } else {
      setVerificationStatus({ ...verificationStatus, emailVerified: false });
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter the correct OTP sent to your email.",
        timer: 4000,
        showConfirmButton: false,
      });
    }
    setOtpEmail("")
  };

  // Verify phone number
  const handleVerifyPhone = () => {
    const staticOtp = "654321"; // temp OTP for test
    // TODO:- static OTP should be replaced when backend is integrated
    // Check if OTP sent matches with entered OTP
    if (otpPhone === staticOtp) {
      setVerificationStatus({ ...verificationStatus, phoneVerified: true });
      setChangesMade({ ...changesMade, phoneNumber: formData.phoneNumber });
      setShowPhoneModal(false);
      Swal.fire({
        icon: "success",
        title: "Phone Number Verified!",
        text: "Your phone number has been verified successfully.",
        timer: 4000,
        showConfirmButton: false,
      });
    } else {
      setVerificationStatus({ ...verificationStatus, emailVerified: true });
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter the correct OTP sent to your phone number.",
        timer: 4000,
        showConfirmButton: false,
      });
    }
    setOtpPhone("");
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
  };

  const openPhoneModal = () => {
    setShowPhoneModal(true);
  };

  const closePhoneModal = () => {
    setShowPhoneModal(false);
  };

  return (
    <Container fluid>
      <Row className="dashboard-title-row">
        <Col>
          <h1 className="dashboard-title">
            <FontAwesomeIcon
              icon={faCircleInfo}
              style={{
                paddingRight: "15px",
                paddingBottom: "1px",
                color: "#1880a9",
                fontSize: "0.75em",
              }}
            />
            USER GENERAL INFORMATION
          </h1>
        </Col>
      </Row>
      <Row className="info-card-row">
        <Col>
          <Card className="info-card">
            <Card.Body>
              <Form>
                <FormGroup label="Full Name" type="text"
                  value={formData.fullName}
                  name="fullName"
                  icon={faUser}
                  readOnly={editField !== "fullName"} 
                  editField={editField} 
                  handleChange={handleChange} 
                  handleEdit={handleEdit} 
                  error={errors.fullName}
                />
                <FormGroup
                  label="Username"
                  type="text"
                  value={formData.username}
                  name="username"
                  icon={faAt}
                  readOnly={editField !== "username"}
                  editField={editField}
                  handleChange={handleChange}
                  handleEdit={handleEdit}
                  error={errors.username}
                />
                <FormGroup
                  label="Email"
                  type="email"
                  value={formData.email}
                  name="email"
                  icon={faEnvelope}
                  readOnly={editField !== "email"}
                  editField={editField}
                  handleChange={handleChange}
                  handleEdit={handleEdit}
                  error={errors.email}
                  additionalContent={
                    editField === "email" && (
                      <Col sm="2" style={{paddingLeft: "80%", paddingTop: "10px" }}>
                        <CustomButton variant="primary" textColor="white" bgColor="#1D9BCE" hoverColor="#3DD5F3" onClick={openEmailModal}>Verify</CustomButton>
                      </Col>
                    )
                  }
                />
                <FormModal
                  showModal={showEmailModal}
                  closeModal={closeEmailModal}
                  title="Email Verification"
                  inputType="text"
                  inputValue={otpEmail}
                  inputPlaceholder="Enter OTP"
                  inputOnChange={(e) => setOtpEmail(e.target.value)}
                  handleSubmit={handleVerifyEmail}
                  submitDisabled={otpEmail.length !== 6}
                />
                <FormGroup
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  name="password"
                  icon={faLock}
                  readOnly={editField !== "password"}
                  editField={editField}
                  handleChange={handleChange}
                  handleEdit={handleEdit}
                  error={errors.password}
                  labelIcon={showPassword ? faEyeSlash : faEye}
                  onLabelIconClick={togglePasswordVisibility}
                />
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3" className="info-label">
                    Phone Number
                  </Form.Label>
                  <Col sm="8">
                    {editField === "phoneNumber" ? (
                      <InputGroup className="mb-3">
                        <Col sm="3">
                          <Form.Select
                            aria-label="Country Code"
                            name="countryCode"
                            value={formData.countryCode || ""}
                            onChange={handleChange}
                            style={{ height: "100%" }}
                          >
                            {countryCodes.map((code) => (
                              <option key={code.value} value={code.value}>
                                {code.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col sm="9">
                          <Form.Control
                            type="text"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            name="phoneNumber"
                            onChange={handleChange}
                          />
                        </Col>
                        {editField === "phoneNumber" && (
                          <Col sm="2" style={{paddingLeft: "80%", paddingTop: "10px" }}>
                            <CustomButton variant="primary" textColor="white" bgColor="#1D9BCE" hoverColor="#3DD5F3" onClick={openPhoneModal}>
                          Verify
                        </CustomButton>
                        </Col>
                      )}
                      </InputGroup>
                    ) : (
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <FontAwesomeIcon
                            icon={faPhone}
                            style={{ paddingRight: "4px" }}
                          />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          value={`${formData.countryCode} ${formData.phoneNumber}`}
                          readOnly={true}
                        />
                      </InputGroup>
                    )}
                    {errors.phoneNumber && (
                      <div className="error-text">{errors.phoneNumber}</div>
                    )}
                    <FormModal
                      showModal={showPhoneModal}
                      closeModal={closePhoneModal}
                      title="Phone Number Verification"
                      inputType="number"
                      inputValue={otpPhone}
                      inputPlaceholder="Enter OTP"
                      inputOnChange={(e) => setOtpPhone(e.target.value)}
                      handleSubmit={handleVerifyPhone}
                      submitDisabled={otpPhone.length !== 6}
                    />
                  </Col>
                  <Col sm="1">
                    <Button
                      variant="link"
                      onClick={() => handleEdit("phoneNumber")}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Col>
                </Form.Group>
                <FormGroup
                  label="Address"
                  type="text"
                  value={formData.address}
                  name="address"
                  icon={faHouse}
                  readOnly={editField !== "address"}
                  editField={editField}
                  handleChange={handleChange}
                  handleEdit={handleEdit}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row
        className="save-button-row justify-content-end"
        style={{ marginRight: "10px" }}
      >
        <Col sm={8} className="text-end">
          <CustomButton
            textColor="white"
            bgColor="#1D9BCE"
            hoverColor="#3DD5F3"
            disabled={Object.keys(errors).length > 0 || !editField}
            onClick={handleSave}
          >
            <FontAwesomeIcon
              icon={faFloppyDisk}
              className="ml-2"
              style={{ paddingRight: "10px" }}
            />
            {saved ? "Saved" : "Save"}
          </CustomButton>
        </Col>
      </Row>

      {/* Password change form */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                isInvalid={!!passwordErrors.currentPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                isInvalid={!!passwordErrors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                isInvalid={!!passwordErrors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <CustomButton variant="primary" textColor="white" bgColor="#1D9BCE" hoverColor="#3DD5F3" onClick={handlePasswordSave}>
            Save
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MenuGeneralInfo;