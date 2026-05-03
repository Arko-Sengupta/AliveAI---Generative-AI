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
import StaticData from "../Utils/StaticText.json";

const donutData = [{ id: "1", Diabetic: 25, "Non-Diabetic": 75 }];

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
  type = "text",
  paddingTop,
  options = [],
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
          <option value="">{StaticData.DiabetesAnalysis.DiabetesAnalysis_Select}</option>
          {options.length > 0 ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            <option disabled>{StaticData.DiabetesAnalysis.DiabetesAnalysis_NoOptions}</option>
          )}
        </select>
      ) : (
        <input
          type={type}
          min={min}
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

InputField.defaultProps = {
  type: "text",
  paddingTop: 0,
  options: [],
  placeholder: "",
  min: null,
};

const InputWithUnit = ({
  label,
  name,
  unitName,
  unitOptions = [],
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
          id={name}
          min={min}
          placeholder={placeholder || ""}
          className="form-control"
          onChange={handleChange}
        />
        <select
          className="form-control"
          name={unitName}
          id={unitName}
          onChange={handleChange}
        >
          <option value="">{StaticData.DiabetesAnalysis.DiabetesAnalysis_Select}</option>
          {unitOptions.length > 0 ? (
            unitOptions.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))
          ) : (
            <option disabled>{StaticData.DiabetesAnalysis.DiabetesAnalysis_NoUnits}</option>
          )}
        </select>
      </div>
    </div>
  );
};

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

  const HandleInputChange = (event) => {
    const { name, value } = event.target;

    if (parseFloat(value) < 0) {
      Swal.fire({
        icon: "warning",
        title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_IncorrectInput_Title,
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

  const HandleAnalysisClick = () => {
    let missingFields = Object.entries(formFields).filter(
      ([key, value]) => value === ""
    );

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_MissingFields_Title,
        text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_MissingFields_Text,
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    const { Height, HeightUnit, HipCircumference, HipCircumferenceUnit, WaistCircumference, WaistCircumferenceUnit, FastingGlucose, FastingGlucoseUnit } = formFields;

    if (HeightUnit === "m") {
      if (Height < 1.4 || Height > 2.0) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidHeight,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_HeightM,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (HeightUnit === "ft") {
      if (Height < 4.6 || Height > 6.5) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidHeight,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_HeightFt,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    if (HipCircumferenceUnit === "cm") {
      if (HipCircumference < 70 || HipCircumference > 160) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidHipCircumference,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_HipCm,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (HipCircumferenceUnit === "m") {
      if (HipCircumference < 0.7 || HipCircumference > 1.6) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidHipCircumference,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_HipM,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (HipCircumferenceUnit === "in") {
      if (HipCircumference < 27.5 || HipCircumference > 63) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidHipCircumference,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_HipIn,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    if (WaistCircumferenceUnit === "cm") {
      if (WaistCircumference < 60 || WaistCircumference > 150) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidWaistCircumference,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_WaistCm,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (WaistCircumferenceUnit === "m") {
      if (WaistCircumference < 0.6 || WaistCircumference > 1.5) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidWaistCircumference,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_WaistM,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (WaistCircumferenceUnit === "in") {
      if (WaistCircumference < 23.5 || WaistCircumference > 69) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidWaistCircumference,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_WaistIn,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

    if (FastingGlucoseUnit === "mg/dL") {
      if (FastingGlucose < 60 || FastingGlucose > 140) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidFastingGlucose,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_GlucoseMgDl,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    } else if (FastingGlucoseUnit === "mg/L") {
      if (FastingGlucose < 600 || FastingGlucose > 1400) {
        Swal.fire({
          icon: "warning",
          title: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_InvalidFastingGlucose,
          text: StaticData.DiabetesAnalysis.DiabetesAnalysis_Alert_GlucoseMgL,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
    }

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
            {StaticData.DiabetesAnalysis.DiabetesAnalysis_Title}
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
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_Age}
            name="Age"
            type="select"
            options={ageOptions}
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_Weight}
            name="Weight"
            type="select"
            options={weightOptions}
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_FamilyHistory}
            name="FamilyHistory"
            type="select"
            options={yesNoOptions}
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_DietaryHabits}
            name="DietaryHabits"
            type="select"
            options={dietaryOptions}
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_MedicationUse}
            name="MedicationUse"
            type="select"
            options={yesNoOptions}
            handleChange={HandleInputChange}
          />
        </Col>
        <Col md={4}>
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_StressLevels}
            name="StressLevels"
            type="select"
            options={levelOptions}
            handleChange={HandleInputChange}
          />
          <InputWithUnit
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_HipCircumference}
            name="HipCircumference"
            unitName="HipCircumferenceUnit"
            unitOptions={generalUnits}
            placeholder={StaticData.DiabetesAnalysis.DiabetesAnalysis_EnterHipCircumference}
            min="1"
            handleChange={HandleInputChange}
          />
          <InputWithUnit
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_FastingGlucose}
            name="FastingGlucose"
            unitName="FastingGlucoseUnit"
            unitOptions={fastingGlucoseUnits}
            placeholder={StaticData.DiabetesAnalysis.DiabetesAnalysis_EnterFastingGlucose}
            min="1"
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_Gender}
            name="Gender"
            type="select"
            options={genderOptions}
            handleChange={HandleInputChange}
          />
          <InputWithUnit
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_Height}
            name="Height"
            unitName="HeightUnit"
            unitOptions={heightUnits}
            placeholder={StaticData.DiabetesAnalysis.DiabetesAnalysis_EnterHeight}
            min="1"
            handleChange={HandleInputChange}
          />
        </Col>
        <Col md={4}>
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_PhysicalActivityLevel}
            name="PhysicalActivityLevel"
            type="select"
            options={levelOptions}
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_EthnicityRace}
            name="EthnicityRace"
            type="select"
            options={ethnicityOptions}
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_SleepDurationQuality}
            name="SleepDurationQuality"
            type="select"
            options={qualityOptions}
            handleChange={HandleInputChange}
          />
          <InputWithUnit
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_WaistCircumference}
            name="WaistCircumference"
            unitName="WaistCircumferenceUnit"
            unitOptions={generalUnits}
            placeholder={StaticData.DiabetesAnalysis.DiabetesAnalysis_EnterWaistCircumference}
            min="1"
            handleChange={HandleInputChange}
          />
          <InputField
            label={StaticData.DiabetesAnalysis.DiabetesAnalysis_SmokingStatus}
            name="SmokingStatus"
            type="select"
            options={smokingStatus}
            handleChange={HandleInputChange}
          />
        </Col>
        <Col md={12} className="text-center my-3">
          <CustomButton
            textColor="white"
            bgColor="#1D9BCE"
            hoverColor="#3DD5F3"
            onClick={HandleAnalysisClick}
          >
            <FontAwesomeIcon
              icon={faChartArea}
              style={{ marginRight: "10px" }}
            />
            {StaticData.DiabetesAnalysis.DiabetesAnalysis_Analysis}
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
                {StaticData.DiabetesAnalysis.DiabetesAnalysis_Report}
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