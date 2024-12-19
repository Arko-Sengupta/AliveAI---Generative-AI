import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../StyleSheets/DashboardMenu.css";
import BarChart from "./Utils/BarChart";
import DonutChart from "./Utils/DonutChart";
import LineChart from "./Utils/LineChart";

const MenuDashboard = () => {
  // Donut Chart properties
  const donutData = [
    { id: "1", "Diabetic": 25, "Non-Diabetic": 75 },
    { id: "2", "Asthmatic": 0, "Non-Asthmatic": 100 },
    { id: "3", "Cadiovas": 0, "Healthy-Cadiovas": 100 },
    { id: "4", "Arthritic": 0, "Non-Arthritic": 100 },
    { id: "5", "Stroke": 0, "Non-Stroke": 100 },
    { id: "6", "Migrane": 0, "Non-Migrane": 100 },
    { id: "7","Bronchitic": 0, "Non-Bronchitic": 100 },
    { id: "8", "Liver": 0, "Healthy-Liver": 100 },
  ];

  const features = [
    "Diabetes",
    "Asthma",
    "Cadiovascular",
    "Arthritis",
    "Heart & Stroke ",
    "Migrane",
    "Bronchitis",
    "Liver Condition",
  ];

  // Common properties for Line and Bar chart
  const percentages = [0, 25, 50, 75, 100];
  const percentageLabel = "Percentages";

  // Line Chart properties
  const peopleData = features.map(() => 25);
  const userData = [25, 0, 0, 0, 0, 0, 0, 0];
  const featureLabel = "Health Features";

  // Bar Chart properties
  const barData = [
    { label: "0-10", value: 30 },
    { label: "11-20", value: 35 },
    { label: "21-30", value: 80 },
    { label: "31-40", value: 45 },
    { label: "41-50", value: 60 },
    { label: "51-60", value: 20 },
    { label: "61-70", value: 90 },
    { label: "71-80", value: 55 },
    { label: "81-90", value: 45 },
    { label: "91-100", value: 65 },
  ];

  const barXAxisLabels = barData.map((d) => d.label);
  const userValueData = 66;

  return (
    <div className="dashboard-wrapper">
      <Container fluid>
        <Row className="dashboard-title-row">
          <Col>
            <h1 className="dashboard-title">
              <FontAwesomeIcon
                icon={faHouse}
                style={{
                  paddingRight: "2px",
                  paddingBottom: "4px",
                  color: "#1880a9",
                  fontSize: "0.75em",
                }}
              />
              USER DASHBOARD
            </h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <Row className="chart-row">
              <Col>
                <BarChart
                  data={barData}
                  yAxisLabels={percentages}
                  xAxisLabels={barXAxisLabels}
                  userValueData={userValueData}
                />
              </Col>
            </Row>
            <Row className="chart-row">
              <Col>
                <LineChart
                  xAxisLabels={features}
                  yAxisLabels={percentages}
                  lineData1={peopleData}
                  lineData2={userData}
                  xAxisLabel={featureLabel}
                  yAxisLabel={percentageLabel}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} lg={6}>
            <Row className="chart-row">
              {donutData.map((data, index) => (
                <Col
                  key={data.id}
                  xs={6}
                  className="chart-col"
                  style={{ marginBottom: "20px" }}
                >
                  <DonutChart
                    data={Object.keys(data)
                      .filter((key) => key !== "id")
                      .map((key) => ({
                        label: key,
                        value: data[key],
                      }))}
                    width={120}
                    height={120}
                    innerRadius={25}
                    outerRadius={45}
                    isGrayedOut={index !== 0}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MenuDashboard;
