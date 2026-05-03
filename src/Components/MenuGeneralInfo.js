import {
  faAt,
  faCircleInfo,
  faEdit,
  faEnvelope,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faHouse,
  faLock,
  faPhone,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import Swal from "sweetalert2";
import "../StyleSheets/DashboardMenu.css";
import { useAuth } from "./Routes/AuthContext";
import CustomButton from "./Utils/CustomButton";
import StaticData from "../Utils/StaticText.json";

const FormGroup = ({
  label,
  type,
  value,
  name,
  icon,
  readOnly,
  editField,
  HandleChange,
  HandleEdit,
  error,
  additionalContent,
  labelIcon,
  onLabelIconClick,
}) => (
  <Form.Group as={Row} className="mb-3 form-group-custom">
    <Form.Label column sm="3" className="info-label">
      {label}
      {labelIcon && (
        <FontAwesomeIcon
          icon={labelIcon}
          style={{ marginLeft: "8px", cursor: "pointer" }}
          onClick={onLabelIconClick}
        />
      )}
    </Form.Label>
    <Col sm="9" className="d-flex align-items-center">
      <InputGroup className={editField === name ? "editable-field" : ""}>
        <InputGroup.Text>
          <FontAwesomeIcon icon={icon} style={{ paddingRight: "6px" }} />
        </InputGroup.Text>
        <Form.Control
          type={type}
          value={value}
          readOnly={readOnly}
          name={name}
          onChange={HandleChange}
        />
      </InputGroup>
      <Button
        variant="link"
        className="ms-3 edit-icon"
        onClick={() => HandleEdit(name)}
      >
        <FontAwesomeIcon icon={faEdit} />
      </Button>
    </Col>
    {error && <div className="error-text">{error}</div>}
    {additionalContent}
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
  submitDisabled,
}) => (
  <Modal
    show={showModal}
    onHide={closeModal}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Control
        type={inputType}
        value={inputValue}
        onChange={inputOnChange}
        placeholder={inputPlaceholder}
        min={0}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={closeModal}>
        {StaticData.GeneralInfo.GeneralInfo_Cancel}
      </Button>
      <CustomButton
        textColor="white"
        bgColor="#1D9BCE"
        hoverColor="#3DD5F3"
        onClick={handleSubmit}
        disabled={submitDisabled}
      >
        {StaticData.GeneralInfo.GeneralInfo_Verify}
      </CustomButton>
    </Modal.Footer>
  </Modal>
);

const MenuGeneralInfo = () => {
  const [formData, setFormData] = useState({
    fullName: "Arko Sengupta",
    username: "arkosengupta",
    email: "arko.sengupta@example.com",
    password: "Password123*",
    countryCode: "+91",
    phoneNumber: "1234567890",
    address: "1234 Delhi, India",
  });

  const [apiData, setApiData] = useState(formData);

  const [editField, setEditField] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [saved, setSaved] = useState(false);
  const [changesMade, setChangesMade] = useState({});
  const [errors, setErrors] = useState({});

  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [verificationStatus, setVerificationStatus] = useState({
    emailVerified: false,
    phoneVerified: false,
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const [showPassChange, setShowPassChange] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { Logout } = useAuth();

  const [buttonStatus, setButtonStatus] = useState(true);

  const countryCodes = [
    { label: "+91", value: "+91" },
    { label: "+1", value: "+1" },
    { label: "+44", value: "+44" },
  ];

  const ValidateForm = useCallback(() => {
    let errors = {};

    if (!ValidateName(formData.fullName)) {
      if (formData.fullName.trim().length === 0) {
        errors.fullName = StaticData.GeneralInfo.GeneralInfo_Err_NameEmpty;
      } else if (/[^a-zA-Z\s]/.test(formData.fullName)) {
        errors.fullName = StaticData.GeneralInfo.GeneralInfo_Err_NameLettersOnly;
      } else if (formData.fullName.trim().length > 30) {
        errors.fullName = StaticData.GeneralInfo.GeneralInfo_Err_NameMaxLength;
      }
    }

    if (!ValidateUsername(formData.username)) {
      const username = formData.username.trim();

      if (username.length === 0) {
        errors.username = StaticData.GeneralInfo.GeneralInfo_Err_UsernameEmpty;
      } else if (/^[0-9]/.test(username)) {
        errors.username = StaticData.GeneralInfo.GeneralInfo_Err_UsernameStartNumber;
      } else if (/[^a-z0-9_]/.test(username)) {
        errors.username = StaticData.GeneralInfo.GeneralInfo_Err_UsernameChars;
      } else if (!/^[a-z_]/.test(username)) {
        errors.username = StaticData.GeneralInfo.GeneralInfo_Err_UsernameStartChar;
      }
    }

    if (!ValidateEmail(formData.email)) {
      setVerificationStatus((prevStatus) => ({
        ...prevStatus,
        emailVerified: false,
      }));
      if (formData.email.trim().length === 0) {
        errors.email = StaticData.GeneralInfo.GeneralInfo_Err_EmailEmpty;
      } else {
        errors.email = StaticData.GeneralInfo.GeneralInfo_Err_EmailInvalid;
      }
    }

    if (!ValidatePassword(formData.password)) {
      if (formData.password.trim().length === 0) {
        errors.password = StaticData.GeneralInfo.GeneralInfo_Err_PasswordEmpty;
      } else {
        errors.password = StaticData.GeneralInfo.GeneralInfo_Err_PasswordFormat;
      }
    }

    if (!ValidatePhoneNumber(formData.phoneNumber)) {
      setVerificationStatus((prevStatus) => ({
        ...prevStatus,
        phoneVerified: false,
      }));
      if (formData.phoneNumber.trim().length === 0) {
        errors.phoneNumber = StaticData.GeneralInfo.GeneralInfo_Err_PhoneEmpty;
      } else {
        errors.phoneNumber = StaticData.GeneralInfo.GeneralInfo_Err_PhoneDigits;
      }
    }

    if (!ValidateAddress(formData.address)) {
      errors.address = StaticData.GeneralInfo.GeneralInfo_Err_AddressEmpty;
    }

    return errors;
  }, [formData]);

  const ValidateName = (name) => {
    const trimmedName = name.trim();
    const hasValidChars = /^[a-zA-Z\s]+$/.test(trimmedName);
    const isNotEmpty = trimmedName.length > 0;
    const isWithinMaxLength = trimmedName.length <= 30;

    return isNotEmpty && hasValidChars && isWithinMaxLength;
  };

  const ValidateUsername = (username) => {
    const trimmedUsername = username.trim();
    const usernameRegex = /^[a-z_][a-z0-9_]*$/;
    const isNotEmpty = trimmedUsername.length > 0;
    const isValidPattern = usernameRegex.test(trimmedUsername);

    return isNotEmpty && isValidPattern;
  };

  const ValidateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
  };

  const ValidatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,18}$/;

    return passwordRegex.test(password);
  };

  const ValidatePhoneNumber = (phoneNumber) => {
    const numericPhone = phoneNumber.replace(/\D/g, "");

    return numericPhone.length === 10;
  };

  const ValidateAddress = (address) => {
    return address.trim().length > 0;
  };

  useEffect(() => {
    setErrors(ValidateForm());
  }, [formData, ValidateForm]);

  const TogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const HandleSave = () => {
    if (Object.keys(changesMade).length > 0) {
      const emailVerificationRequired =
        changesMade.email && !verificationStatus.emailVerified;
      const phoneVerificationRequired =
        changesMade.phoneNumber && !verificationStatus.phoneVerified;

      if (emailVerificationRequired || phoneVerificationRequired) {
        Swal.fire({
          icon: "error",
          title: StaticData.GeneralInfo.GeneralInfo_Alert_VerificationRequired_Title,
          text: StaticData.GeneralInfo.GeneralInfo_Alert_VerificationRequired_Text,
          timer: 4000,
          showConfirmButton: false,
        });
        return;
      }
    }

    setSaved(true);

    setEditField(null);

    setTimeout(() => {
      setSaved(false);
    }, 2000);

    setApiData(formData);
    setButtonStatus(true);
    setVerificationStatus({ emailVerified: false, phoneVerified: false });

    Swal.fire({
      icon: "success",
      title: StaticData.GeneralInfo.GeneralInfo_Alert_Saved_Title,
      text: StaticData.GeneralInfo.GeneralInfo_Alert_Saved_Text,
      timer: 4000,
      showConfirmButton: false,
    });
  };

  const HandleDelete = async () => {
    const { value: otpValues } = await Swal.fire({
      title: StaticData.GeneralInfo.GeneralInfo_Alert_EnterOtps_Title,
      html: `
        <input id="emailOtp" class="swal2-input" placeholder="${StaticData.GeneralInfo.GeneralInfo_Alert_EnterOtps_EmailPlaceholder}" type="number" min='0'>
        <input id="phoneOtp" class="swal2-input" placeholder="${StaticData.GeneralInfo.GeneralInfo_Alert_EnterOtps_PhonePlaceholder}" type="number" min='0'>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: StaticData.GeneralInfo.GeneralInfo_Verify,
      cancelButtonText: StaticData.GeneralInfo.GeneralInfo_Cancel,
      customClass: {
        confirmButton: "btn-blue",
        cancelButton: "btn-blue",
      },
      preConfirm: () => {
        const emailOtp = Swal.getPopup().querySelector("#emailOtp").value;
        const phoneOtp = Swal.getPopup().querySelector("#phoneOtp").value;

        if (!/^\d{6}$/.test(emailOtp)) {
          Swal.showValidationMessage(StaticData.GeneralInfo.GeneralInfo_Alert_EmailOtpDigits);
          return false;
        }
        if (!/^\d{6}$/.test(phoneOtp)) {
          Swal.showValidationMessage(StaticData.GeneralInfo.GeneralInfo_Alert_PhoneOtpDigits);
          return false;
        }
        if (emailOtp !== StaticData.Credentials.emailOtp) {
          Swal.showValidationMessage(StaticData.GeneralInfo.GeneralInfo_Alert_IncorrectEmailOtp);
          return false;
        }
        if (phoneOtp !== StaticData.Credentials.phoneOtp) {
          Swal.showValidationMessage(StaticData.GeneralInfo.GeneralInfo_Alert_IncorrectPhoneOtp);
          return false;
        }
        return { emailOtp, phoneOtp };
      },
    });

    if (otpValues) {
      Swal.fire({
        title: StaticData.GeneralInfo.GeneralInfo_Alert_ConfirmDelete_Title,
        text: StaticData.GeneralInfo.GeneralInfo_Alert_ConfirmDelete_Text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: StaticData.GeneralInfo.GeneralInfo_Alert_ConfirmDelete_Button,
        customClass: {
          cancelButton: "btn-blue",
        },
      })
        .then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: StaticData.GeneralInfo.GeneralInfo_Alert_Deleted_Title,
              text: StaticData.GeneralInfo.GeneralInfo_Alert_Deleted_Text,
              icon: "success",
              timer: 3000,
              customClass: {
                confirmButton: "btn-blue",
              },
            });
          }
        })
        .then(() => {
          localStorage.removeItem("isLoggedIn");
          setTimeout(() => {
            Logout();
          }, [3000]);
        });
    }
  };

  const HandleEdit = (field) => {
    if (field === "password") {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setShowPasswordModal(true);
    } else {
      setEditField(field);
    }
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setVerificationStatus({ ...verificationStatus, emailVerified: false });
    }

    if (name === "phoneNumber") {
      setVerificationStatus({ ...verificationStatus, phoneVerified: false });
    }

    setFormData({ ...formData, [name]: value });
    setChangesMade({ ...changesMade, [name]: value });
  };

  const HandlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const HandlePasswordSave = () => {
    let errors = {};
    if (passwordForm.currentPassword !== formData.password) {
      errors.currentPassword = StaticData.GeneralInfo.GeneralInfo_Err_CurrentPasswordIncorrect;
    }
    if (!ValidatePassword(passwordForm.newPassword)) {
      errors.newPassword = StaticData.GeneralInfo.GeneralInfo_Err_PasswordFormat;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = StaticData.GeneralInfo.GeneralInfo_Err_PasswordMismatch;
    }
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setFormData({ ...formData, password: passwordForm.newPassword });
    setChangesMade({ ...changesMade, password: passwordForm.newPassword });
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    Swal.fire({
      icon: "success",
      title: StaticData.GeneralInfo.GeneralInfo_Alert_PasswordChanged_Title,
      text: StaticData.GeneralInfo.GeneralInfo_Alert_PasswordChanged_Text,
      timer: 4000,
      showConfirmButton: false,
    });
  };

  const HandleVerifyEmail = () => {
    const staticOtp = StaticData.Credentials.emailOtp;
    if (otpEmail === staticOtp) {
      setVerificationStatus({ ...verificationStatus, emailVerified: true });
      setChangesMade({ ...changesMade, email: formData.email });
      setShowEmailModal(false);
      Swal.fire({
        icon: "success",
        title: StaticData.GeneralInfo.GeneralInfo_Alert_EmailVerified_Title,
        text: StaticData.GeneralInfo.GeneralInfo_Alert_EmailVerified_Text,
        timer: 4000,
        showConfirmButton: false,
      });
    } else {
      setVerificationStatus({ ...verificationStatus, emailVerified: false });
      Swal.fire({
        icon: "error",
        title: StaticData.GeneralInfo.GeneralInfo_Alert_InvalidOtp_Title,
        text: StaticData.GeneralInfo.GeneralInfo_Alert_InvalidEmailOtp_Text,
        timer: 4000,
        showConfirmButton: false,
      });
    }
    setOtpEmail("");
  };

  const HandleVerifyPhone = () => {
    const staticOtp = StaticData.Credentials.phoneOtp;
    if (otpPhone === staticOtp) {
      setVerificationStatus({ ...verificationStatus, phoneVerified: true });
      setChangesMade({ ...changesMade, phoneNumber: formData.phoneNumber });
      setShowPhoneModal(false);
      Swal.fire({
        icon: "success",
        title: StaticData.GeneralInfo.GeneralInfo_Alert_PhoneVerified_Title,
        text: StaticData.GeneralInfo.GeneralInfo_Alert_PhoneVerified_Text,
        timer: 4000,
        showConfirmButton: false,
      });
    } else {
      setVerificationStatus({ ...verificationStatus, phoneVerified: false });
      Swal.fire({
        icon: "error",
        title: StaticData.GeneralInfo.GeneralInfo_Alert_InvalidOtp_Title,
        text: StaticData.GeneralInfo.GeneralInfo_Alert_InvalidPhoneOtp_Text,
        timer: 4000,
        showConfirmButton: false,
      });
    }
    setOtpPhone("");
  };

  useEffect(() => {
    const fieldsToCompare = [
      "fullName",
      "username",
      "email",
      "password",
      "phoneNumber",
      "address",
    ];

    const isFormDataSameAsApiData = fieldsToCompare.every(
      (field) => formData[field] === apiData[field]
    );
    setButtonStatus(isFormDataSameAsApiData);

    if (Object.keys(errors).length !== 0) {
      setButtonStatus(true);
    }
  }, [formData, apiData, errors]);

  return (
    <Container fluid>
      <Row className="dashboard-title-row">
        <Col>
          <h1 className="dashboard-title">
            <FontAwesomeIcon
              icon={faCircleInfo}
              style={{
                paddingRight: "2px",
                paddingBottom: "1px",
                color: "#1880a9",
                fontSize: "0.75em",
              }}
            />
            {StaticData.GeneralInfo.GeneralInfo_Title}
          </h1>
        </Col>
      </Row>
      <Row className="info-card-row">
        <Col>
          <Card className="info-card">
            <Card.Body>
              <Form>
                <FormGroup
                  label={StaticData.GeneralInfo.GeneralInfo_FullName}
                  type="text"
                  value={formData.fullName}
                  name="fullName"
                  icon={faUser}
                  readOnly={editField !== "fullName"}
                  editField={editField}
                  HandleChange={HandleChange}
                  HandleEdit={HandleEdit}
                  error={errors.fullName}
                />
                <FormGroup
                  label={StaticData.GeneralInfo.GeneralInfo_Username}
                  type="text"
                  value={formData.username}
                  name="username"
                  icon={faAt}
                  readOnly={editField !== "username"}
                  editField={editField}
                  HandleChange={HandleChange}
                  HandleEdit={HandleEdit}
                  error={errors.username}
                />
                <FormGroup
                  label={StaticData.GeneralInfo.GeneralInfo_Email}
                  type="email"
                  value={formData.email}
                  name="email"
                  icon={faEnvelope}
                  readOnly={editField !== "email"}
                  editField={editField}
                  HandleChange={HandleChange}
                  HandleEdit={HandleEdit}
                  error={errors.email}
                  additionalContent={
                    editField === "email" && (
                      <Col
                        sm="2"
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          width: "100%",
                          paddingTop: "10px",
                          paddingInline: "50px",
                        }}
                      >
                        <CustomButton
                          variant="primary"
                          textColor="white"
                          bgColor="#1D9BCE"
                          hoverColor="#3DD5F3"
                          onClick={() => setShowEmailModal(true)}
                          disabled={!ValidateEmail(formData.email)}
                        >
                          {StaticData.GeneralInfo.GeneralInfo_Verify}
                        </CustomButton>
                      </Col>
                    )
                  }
                />
                <FormModal
                  showModal={showEmailModal}
                  closeModal={() => setShowEmailModal(false)}
                  title={StaticData.GeneralInfo.GeneralInfo_EmailVerification}
                  inputType="number"
                  inputValue={otpEmail}
                  inputPlaceholder={StaticData.GeneralInfo.GeneralInfo_EnterOtp}
                  inputOnChange={(e) => setOtpEmail(e.target.value)}
                  handleSubmit={HandleVerifyEmail}
                  submitDisabled={otpEmail.length !== 6}
                />
                <FormGroup
                  label={StaticData.GeneralInfo.GeneralInfo_Password}
                  type={!showPassword ? "text" : "password"}
                  value={formData.password}
                  name="password"
                  icon={faLock}
                  readOnly={editField !== "password"}
                  editField={editField}
                  HandleChange={HandleChange}
                  HandleEdit={HandleEdit}
                  error={errors.password}
                  labelIcon={showPassword ? faEyeSlash : faEye}
                  onLabelIconClick={TogglePasswordVisibility}
                />
                <Form.Group as={Row} className="mb-3 form-group-custom">
                  <Form.Label column sm="3" className="info-label">
                    {StaticData.GeneralInfo.GeneralInfo_Phone}
                  </Form.Label>
                  <Col sm="9" className="d-flex align-items-center">
                    {editField === "phoneNumber" ? (
                      <InputGroup className="w-100">
                        <div className="d-flex w-100">
                          <Col className="pe-3">
                            <Form.Select
                              aria-label={StaticData.GeneralInfo.GeneralInfo_CountryCode}
                              name="countryCode"
                              value={formData.countryCode || ""}
                              onChange={HandleChange}
                              style={{
                                height: "100%",
                                minWidth: "80px",
                                maxWidth: "100px",
                              }}
                            >
                              {countryCodes.map((code) => (
                                <option key={code.value} value={code.value}>
                                  {code.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>
                          <Form.Control
                            type="text"
                            placeholder={StaticData.GeneralInfo.GeneralInfo_Phone}
                            value={formData.phoneNumber}
                            name="phoneNumber"
                            onChange={HandleChange}
                          />
                        </div>
                      </InputGroup>
                    ) : (
                      <InputGroup className="w-100">
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
                    <Button
                      variant="link"
                      className="ms-3 edit-icon"
                      onClick={() => HandleEdit("phoneNumber")}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Col>
                  {errors.phoneNumber && (
                    <div className="error-text">{errors.phoneNumber}</div>
                  )}
                  {editField === "phoneNumber" && (
                    <Col
                      sm="2"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        width: "100%",
                        paddingTop: "10px",
                        paddingInline: "50px",
                      }}
                    >
                      <CustomButton
                        variant="primary"
                        textColor="white"
                        bgColor="#1D9BCE"
                        hoverColor="#3DD5F3"
                        onClick={() => setShowPhoneModal(true)}
                        disabled={!ValidatePhoneNumber(formData.phoneNumber)}
                      >
                        {StaticData.GeneralInfo.GeneralInfo_Verify}
                      </CustomButton>
                    </Col>
                  )}
                  <FormModal
                    showModal={showPhoneModal}
                    closeModal={() => setShowPhoneModal(false)}
                    title={StaticData.GeneralInfo.GeneralInfo_PhoneVerification}
                    inputType="number"
                    inputValue={otpPhone}
                    inputPlaceholder={StaticData.GeneralInfo.GeneralInfo_EnterOtp}
                    inputOnChange={(e) => setOtpPhone(e.target.value)}
                    handleSubmit={HandleVerifyPhone}
                    submitDisabled={otpPhone.length !== 6}
                  />
                </Form.Group>
                <FormGroup
                  label={StaticData.GeneralInfo.GeneralInfo_Address}
                  type="text"
                  value={formData.address}
                  name="address"
                  icon={faHouse}
                  readOnly={editField !== "address"}
                  editField={editField}
                  HandleChange={HandleChange}
                  HandleEdit={HandleEdit}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row
        className="save-button-row justify-content-end"
        style={{ marginInline: "10px", marginTop: "40px", marginBottom: "50px" }}
      >
        <Col
          sm={8}
          className="text-end d-flex justify-content-end gap-4 w-100 "
        >
          <CustomButton
            textColor="white"
            bgColor="#ef4444"
            hoverColor="#dc2626"
            onClick={HandleDelete}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="ml-2"
              style={{ paddingRight: "10px" }}
            />
            {StaticData.GeneralInfo.GeneralInfo_Delete}
          </CustomButton>
          <CustomButton
            textColor="white"
            bgColor="#1D9BCE"
            hoverColor="#3DD5F3"
            disabled={buttonStatus}
            onClick={HandleSave}
          >
            <FontAwesomeIcon
              icon={faFloppyDisk}
              className="ml-2"
              style={{ paddingRight: "10px" }}
            />
            {saved ? StaticData.GeneralInfo.GeneralInfo_Saved : StaticData.GeneralInfo.GeneralInfo_Save}
          </CustomButton>
        </Col>
      </Row>

      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{StaticData.GeneralInfo.GeneralInfo_ResetPassword}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formCurrentPassword">
              <Form.Label>{StaticData.GeneralInfo.GeneralInfo_CurrentPassword}</Form.Label>

              <div className="d-flex justify-content-center align-items-center">
                <Form.Control
                  type={showPassChange.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={HandlePasswordChange}
                  isInvalid={!!passwordErrors.currentPassword}
                />
                <FontAwesomeIcon
                  icon={showPassChange.currentPassword ? faEye : faEyeSlash}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() =>
                    setShowPassChange({
                      ...showPassChange,
                      currentPassword: !showPassChange.currentPassword,
                    })
                  }
                />
              </div>

              <Form.Control.Feedback type="invalid">
                {passwordErrors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>{StaticData.GeneralInfo.GeneralInfo_NewPassword}</Form.Label>

              <div className="d-flex justify-content-center align-items-center">
                <Form.Control
                  type={showPassChange.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={HandlePasswordChange}
                  isInvalid={!!passwordErrors.newPassword}
                />
                <FontAwesomeIcon
                  icon={showPassChange.newPassword ? faEye : faEyeSlash}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() =>
                    setShowPassChange({
                      ...showPassChange,
                      newPassword: !showPassChange.newPassword,
                    })
                  }
                />
              </div>

              <Form.Control.Feedback type="invalid">
                {passwordErrors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>{StaticData.GeneralInfo.GeneralInfo_ConfirmPassword}</Form.Label>

              <div className="d-flex justify-content-center align-items-center">
                <Form.Control
                  type={showPassChange.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={HandlePasswordChange}
                  isInvalid={!!passwordErrors.confirmPassword}
                />
                <FontAwesomeIcon
                  icon={showPassChange.confirmPassword ? faEye : faEyeSlash}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() =>
                    setShowPassChange({
                      ...showPassChange,
                      confirmPassword: !showPassChange.confirmPassword,
                    })
                  }
                />
              </div>

              <Form.Control.Feedback type="invalid">
                {passwordErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            {StaticData.GeneralInfo.GeneralInfo_Cancel}
          </Button>
          <CustomButton
            variant="primary"
            textColor="white"
            bgColor="#1D9BCE"
            hoverColor="#3DD5F3"
            onClick={HandlePasswordSave}
          >
            {StaticData.GeneralInfo.GeneralInfo_Save}
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MenuGeneralInfo;