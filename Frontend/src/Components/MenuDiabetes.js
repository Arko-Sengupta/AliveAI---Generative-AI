import {
  faChartArea,
  faFileLines,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import "../StyleSheets/DashboardMenu.css";
import CustomButton from "./Utils/CustomButton";
import DonutChart from "./Utils/DonutChart";
import ECGAnimation from "./Utils/ECGAnimation";

// Donut chart data
const donutData = [{ id: "1", Diabetic: 25, "Non-Diabetic": 75 }];

// TODO: JSON to be replaced with API data
const reportData = {
  "Name": "Arko Sengupta",
  "Email": "arkosengupta9@gmail.com",
  "HbA1c": "value 1",
  "Waist-to-Hip Ratio": "value 2",
  "BMI": "value 3",
  "Cholesterol Level": "value 4",
  "Diabetic Category": "Pre Diabetic",
  "Diabetic Percentage": "25",
};

// Select options
const ageOptions = Array.from({ length: 100 - 18 + 1 }, (_, i) => ({
  value: i + 18,
  label: i + 18,
}));

const weightOptions = Array.from({ length: 150 - 40 + 1 }, (_, i) => ({
  value: i + 40,
  label: i + 40,
}));

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const dietaryOptions = [
  { value: "nonveg", label: "Non-Veg" },
  { value: "veg", label: "Vegetarian" },
  { value: "keto", label: "Keto" },
  { value: "medi", label: "Mediterranean" },
  { value: "paleo", label: "Paleo" },
  { value: "vegan", label: "Vegan" },
  { value: "flexi", label: "Flexitarian" },
  { value: "wholefood", label: "Whole Food Plant-Based" },
  { value: "pesca", label: "Pescatarian" },
];

const levelOptions = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

const generalUnits = [
  { value: "cm", label: "cm" },
  { value: "m", label: "m" },
  { value: "in", label: "in" },
];

const fastingGlucoseUnits = [
  { value: "mg/dL", label: "mg/dL" },
  { value: "mg/L", label: "mg/L" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" }
];

const heightUnits = [
  { value: "m", label: "m" },
  { value: "ft", label: "ft" },
];

const ethnicityOptions = [
  { value: "caucasian", label: "Caucasian" },
  { value: "asian", label: "Asian" },
  { value: "hislat", label: "Hispanic/Latino" },
  { value: "afram", label: "African/American" },
  { value: "mixedmul", label: "Mixed/Multiethnic" },
  { value: "mideast", label: "Middle Eastern/North African" },
];

const qualityOptions = [
  { value: "poor", label: "Poor" },
  { value: "fair", label: "Fair" },
  { value: "good", label: "Good" },
  { value: "excellent", label: "Excellent" },
];

const smokingStatus = [
  { value: "smoker", label: "Smoker" },
  { value: "nonsmoker", label: "Non-Smoker" },
];

const InputField = ({
  label,
  name,
  type = "text", // Default type to "text"
  paddingTop,
  options = [], // Default to an empty array for select options
  handleChange,
  placeholder,
  min,
}) => {
  return (
    <div className="mb-3 diabetes-form-title">
      <label htmlFor={name} style={{ paddingTop: paddingTop || 0 }}>
        {label}
        <span style={{ color: "red" }}>*</span>
      </label>

      {type === "select" ? (
        <select
          className="form-control"
          name={name}
          id={name}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {options.length > 0 ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            <option disabled>No options available</option>
          )}
        </select>
      ) : (
        <input
          type={type}
          min={min} // Only applied if "min" is provided
          name={name}
          id={name}
          placeholder={placeholder || ""}
          className="form-control"
          onChange={handleChange}
        />
      )}
    </div>
  );
};

// Adding prop types for validation
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  handleChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Adding default props for optional values
InputField.defaultProps = {
  type: "text",
  paddingTop: 0,
  options: [],
  placeholder: "",
  min: null,
};

// Reusable Input with units component
const InputWithUnit = ({
  label,
  name,
  unitName,
  unitOptions = [], // Default to an empty array
  paddingTop,
  placeholder,
  min,
  handleChange,
}) => {
  return (
    <div className="mb-3 diabetes-form-title">
      <label htmlFor={name} style={{ paddingTop: paddingTop || 0 }}>
        {label}
        <span style={{ color: "red" }}>*</span>
      </label>
      <div className="d-flex" style={{ columnGap: "10px" }}>
        <input
          type="number"
          name={name}
          id={name} // Accessibility: link input to label
          min={min}
          placeholder={placeholder || ""}
          className="form-control"
          onChange={handleChange}
        />
        <select
          className="form-control"
          name={unitName}
          id={unitName} // Accessibility: link select to label
          onChange={handleChange}
        >
          <option value="">Select</option>
          {unitOptions.length > 0 ? (
            unitOptions.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))
          ) : (
            <option disabled>No units available</option>
          )}
        </select>
      </div>
    </div>
  );
};

// Adding PropTypes for validation
InputWithUnit.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  unitName: PropTypes.string.isRequired,
  unitOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChange: PropTypes.func.isRequired,
};

// Adding default props for optional values
InputWithUnit.defaultProps = {
  unitOptions: [],
  paddingTop: 0,
  placeholder: "",
  min: null,
};

const MenuDiabetes = () => {
  const [formFields, setFormFields] = useState({
    Age: "",
    Weight: "",
    FamilyHistory: "",
    DietaryHabits: "",
    MedicationUse: "",
    StressLevels: "",
    HipCircumference: "",
    HipCircumferenceUnit: "",
    FastingGlucose: "",
    FastingGlucoseUnit: "",
    Gender: "",
    Height: "",
    HeightUnit: "",
    PhysicalActivityLevel: "",
    EthnicityRace: "",
    SleepDurationQuality: "",
    WaistCircumference: "",
    WaistCircumferenceUnit: "",
    SmokingStatus: "",
  });

  const [showECG, setShowECG] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (parseFloat(value) < 0) {
      Swal.fire({
        icon: "warning",
        title: "Incorrect Input",
        text: `The Field '${name}' cannot be Negative.`,
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleAnalysisClick = () => {
    let missingFields = Object.entries(formFields).filter(
      ([key, value]) => value === ""
    );

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all the fields.",
        timer: 3000,
        showConfirmButton: false,
      });
      return; // Ensure to return after showing the alert
    }

    const { Height, HeightUnit, HipCircumference, HipCircumferenceUnit, WaistCircumference, WaistCircumferenceUnit, FastingGlucose, FastingGlucoseUnit } = formFields;

    // Validate Height
    if (HeightUnit === "m") {
      if (Height < 1.4 || Height > 2.0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Height",
          text: "Height should be between 1.4 and 2.0 m",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (HeightUnit === "ft") {
      if (Height < 4.6 || Height > 6.5) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Height",
          text: "Height should be between 4.6 and 6.5 ft",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    // Validate Hip Circumference
    if (HipCircumferenceUnit === "cm") {
      if (HipCircumference < 70 || HipCircumference > 160) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Hip Circumference",
          text: "Hip Circumference should be between 70 and 160 cm",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (HipCircumferenceUnit === "m") {
      if (HipCircumference < 0.7 || HipCircumference > 1.6) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Hip Circumference",
          text: "Hip Circumference should be between 0.7 and 1.6 m",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (HipCircumferenceUnit === "in") {
      if (HipCircumference < 27.5 || HipCircumference > 63) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Hip Circumference",
          text: "Hip Circumference should be between 27.5 and 63 in",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    // Validate Waist Circumference
    if (WaistCircumferenceUnit === "cm") {
      if (WaistCircumference < 60 || WaistCircumference > 150) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Waist Circumference",
          text: "Waist Circumference should be between 60 and 150 cm",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (WaistCircumferenceUnit === "m") {
      if (WaistCircumference < 0.6 || WaistCircumference > 1.5) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Waist Circumference",
          text: "Waist Circumference should be between 0.6 and 1.5 m",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (WaistCircumferenceUnit === "in") {
      if (WaistCircumference < 23.5 || WaistCircumference > 69) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Waist Circumference",
          text: "Waist Circumference should be between 23.5 and 69 in",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    // Validate Fasting Glucose
    if (FastingGlucoseUnit === "mg/dL") {
      if (FastingGlucose < 60 || FastingGlucose > 140) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Fasting Glucose",
          text: "Fasting Blood Glucose should be between 60 and 140 mg/dL",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (FastingGlucoseUnit === "mg/L") {
      if (FastingGlucose < 600 || FastingGlucose > 1400) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Fasting Glucose",
          text: "Fasting Blood Glucose should be between 600 and 1400 mg/L",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    // Proceed if all validations pass
    setShowECG(true);
    setShowReport(false);
    setTimeout(() => {
      setShowECG(false);
      setShowReport(true);
    }, 5000);
  };


  return (
    <Container fluid>
      <Row className="dashboard-title-row">
        <Col>
          <h1 className="dashboard-title">
            <FontAwesomeIcon
              icon={faNotesMedical}
              style={{
                paddingRight: "15px",
                paddingBottom: "1px",
                color: "#1880a9",
                fontSize: "0.75em",
              }}
            />
            DIABETES ANALYSIS
          </h1>
        </Col>
      </Row>

      <Row
        style={{
          overflowY: "auto",
          color: "#1D9BCE",
          fontWeight: "600",
        }}
      >
        <Col md={4}>
          <InputField
            label="Age"
            name="Age"
            type="select"
            options={ageOptions}
            handleChange={handleInputChange}
          />
          <InputField
            label="Weight (Kgs)"
            name="Weight"
            type="select"
            options={weightOptions}
            handleChange={handleInputChange}
          />
          <InputField
            label="Family History"
            name="FamilyHistory"
            type="select"
            options={yesNoOptions}
            handleChange={handleInputChange}
          />
          <InputField
            label="Dietary Habits"
            name="DietaryHabits"
            type="select"
            options={dietaryOptions}
            handleChange={handleInputChange}
          />
          <InputField
            label="Medication Use"
            name="MedicationUse"
            type="select"
            options={yesNoOptions}
            handleChange={handleInputChange}
          />
        </Col>
        <Col md={4}>
          <InputField
            label="Stress Levels"
            name="StressLevels"
            type="select"
            options={levelOptions}
            handleChange={handleInputChange}
          />
          <InputWithUnit
            label="Hip Circumference"
            name="HipCircumference"
            unitName="HipCircumferenceUnit"
            unitOptions={generalUnits}
            placeholder="Enter Hip Circumference"
            min="1"
            handleChange={handleInputChange}
          />
          <InputWithUnit
            label="Fasting Glucose"
            name="FastingGlucose"
            unitName="FastingGlucoseUnit"
            unitOptions={fastingGlucoseUnits}
            placeholder="Enter Fasting Glucose"
            min="1"
            handleChange={handleInputChange}
          />
          <InputField
            label="Gender"
            name="Gender"
            type="select"
            options={genderOptions}
            handleChange={handleInputChange}
          />
          <InputWithUnit
            label="Height"
            name="Height"
            unitName="HeightUnit"
            unitOptions={heightUnits}
            placeholder="Enter Height"
            min="1"
            handleChange={handleInputChange}
          />
        </Col>
        <Col md={4}>
          <InputField
            label="Physical Activity Level"
            name="PhysicalActivityLevel"
            type="select"
            options={levelOptions}
            handleChange={handleInputChange}
          />
          <InputField
            label="Ethnicity/Race"
            name="EthnicityRace"
            type="select"
            options={ethnicityOptions}
            handleChange={handleInputChange}
          />
          <InputField
            label="Sleep Duration/Quality"
            name="SleepDurationQuality"
            type="select"
            options={qualityOptions}
            handleChange={handleInputChange}
          />
          <InputWithUnit
            label="Waist Circumference"
            name="WaistCircumference"
            unitName="WaistCircumferenceUnit"
            unitOptions={generalUnits}
            placeholder="Enter Waist Circumference"
            min="1"
            handleChange={handleInputChange}
          />
          <InputField
            label="Smoking Status"
            name="SmokingStatus"
            type="select"
            options={smokingStatus}
            handleChange={handleInputChange}
          />
        </Col>
        <Col md={12} className="text-center my-3">
          <CustomButton
            textColor="white"
            bgColor="#1D9BCE"
            hoverColor="#3DD5F3"
            onClick={handleAnalysisClick}
          >
            <FontAwesomeIcon
              icon={faChartArea}
              style={{ marginRight: "10px" }}
            />
            Analysis
          </CustomButton>
        </Col>
      </Row>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: "20px" }}
      >
        {showECG && <ECGAnimation />}
      </div>
      {showReport && (
        <Row>
          <Col md={6}>
            <div className="chart-container-menu-diabetes">
              <h2
                style={{
                  color: "#1880a9",
                  paddingBottom: "20px",
                  fontWeight: "bold",
                  fontFamily: "Cinzel Decorative",
                  fontSize: "25px",
                  textAlign: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faFileLines}
                  style={{
                    paddingRight: "15px",
                    paddingBottom: "1px",
                    color: "#1880a9",
                    fontSize: "0.75em",
                  }}
                />
                Report
              </h2>
              <div className="report-data">
                {Object.entries(reportData).map(([key, value], index) => (
                  <div className="report-item" key={index}>
                    <span className="report-label">{key}:</span>
                    <span
                      className="report-value"
                      style={{ animationDelay: `${index * 1}s` }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col md={6}>
            {donutData.map((data) => (
              <DonutChart
                data={Object.keys(data)
                  .filter((key) => key !== "id")
                  .map((key) => ({
                    label: key,
                    value: data[key],
                  }))}
                width={220}
                height={240}
                innerRadius={25}
                outerRadius={45}
                isHeadingrequired={true}
              />
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MenuDiabetes;