import {
  faChartArea,
  faFileLines,
  faMagnifyingGlassChart,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as d3 from "d3";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import "../StyleSheets/DashboardMenu.css";
import CustomButton from "./Utils/CustomButton";
import ECGAnimation from "./Utils/ECGAnimation";

// Donut chart data
const donutData = [{ id: "1", Diabetic: 25, "Non-Diabetic": 75 }];

// TODO: JSON to be replaced with API data
const reportData = {
  Name: "Arko Sengupta",
  Email: "arko.sengupta@ex.com",
  HbA1c: "value 1",
  "Waist-to-hip ratio": "value 2",
  BMI: "value 3",
  "Cholesterol Level": "value 4",
  "Diabetic Category": "Pre Diabetic",
  "Diabetic Percentage": "25",
};

// Select options
const ageOptions = Array.from({ length: 110 }, (_, i) => ({
  value: i + 1,
  label: i + 1,
}));

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const dietaryOptions = [
  { value: "nonveg", label: "Non-Vegetarian" },
  { value: "veg", label: "Vegetarian" },
  { value: "keto", label: "Keto" },
  { value: "medi", label: "Mediterranean" },
  { value: "paleo", label: "Paleo" },
  { value: "vegan", label: "Vegan" },
  { value: "flexi", label: "Flexitarian" },
  { value: "wholefood", label: "Whole Food Plant-based" },
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
  { value: "unit1", label: "Unit 1" },
  { value: "unit2", label: "Unit 2" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "transgender", label: "Transgender" },
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

// TODO: Replace this DonutChart with Utils donut chart
// Donut Chart of Menu Diabetes needs a title, hence causing an issue
const DonutChart = ({
  data,
  width = 200,
  height = 200,
  innerRadius = 45,
  outerRadius = 75,
}) => {
  const ref = useRef();

  const label1 = data[0].label;
  const value1 = data[0].value;

  const label2 = data[1].label;
  const value2 = data[1].value;

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(["#1D9BCE", "#3DD5F3"]);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .attr("transform", "rotate(0)")
      .transition()
      .duration(2000)
      .attrTween("d", function (d) {
        var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      })
      .attrTween("transform", function () {
        return d3.interpolateString("rotate(0, 0)", "rotate(360, 0)");
      });
  }, [data, width, height, innerRadius, outerRadius]);

  return (
    <div className="chart-container-menu-diabetes">
      <h2
        style={{
          color: "#1880a9",
          fontWeight: "bold",
          fontFamily: "Cinzel Decorative",
          fontSize: "25px",
        }}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlassChart}
          style={{
            paddingRight: "15px",
            paddingBottom: "1px",
            color: "#1880a9",
            fontSize: "0.75em",
          }}
        />
        Analysis
      </h2>
      <svg ref={ref}></svg>
      <div className="labels-menu-diabetes">
        <div className="label-diabetes left-diabetes">
          <span
            className="color-box-menu-diabetes"
            style={{ backgroundColor: "#1D9BCE" }}
          ></span>{" "}
          {label1}: {value1}%
        </div>
        <div className="label-diabetes right-diabetes">
          <span
            className="color-box-menu-diabetes"
            style={{ backgroundColor: "#3DD5F3" }}
          ></span>{" "}
          {label2}: {value2}%
        </div>
      </div>
    </div>
  );
};

// Reusable Input field component
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
        text: `The field '${name}' cannot be negative.`,
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
    } else {
      setShowECG(true);
      setShowReport(false);
      setTimeout(() => {
        setShowECG(false);
        setShowReport(true);
      }, 5000);
    }
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
            type="number"
            placeholder="Enter Weight"
            min="1"
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

      {showECG && <ECGAnimation />}
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
              />
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MenuDiabetes;
