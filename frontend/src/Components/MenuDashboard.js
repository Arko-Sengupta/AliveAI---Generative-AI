import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../StyleSheets/DashboardMenu.css";
import DonutChart from "./Utils/DonutChart";
import LineChart from "./Utils/LineChart";

// TODO:- Make bar chart a reusable component allowing users to decide whether to have a highlighted bar or not.
// This is specific for Menu Dashboard now
const BarChart = ({
  data,
  yAxisLabels,
  xAxisLabels,
  userValueData,
  width = 400,
  height = 300,
}) => {
  const ref = useRef();

  if (window.matchMedia("(max-width: 480px)").matches) {
    height = 200;
  } else {
    height = 300;
  }

  useEffect(() => {
    // Set height and width of svg element
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 30 };
    const containerWidth = ref.current.parentElement.clientWidth;
    const containerHeight = height;
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    // X-axis properties
    const x = d3
      .scaleBand()
      .domain(xAxisLabels)
      .range([0, innerWidth])
      .padding(0.4);

    // Y-axis properties
    const y = d3.scaleLinear().domain([0, 100]).nice().range([innerHeight, 0]);

    const yAxis = d3
      .axisLeft(y)
      .tickValues(yAxisLabels)
      .tickFormat((d) => `${d}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g").call(yAxis);

    // Y-axis label
    g.append("text")
      .attr("class", "axis-label")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.right - 60)
      .attr("x", -innerHeight / 2)
      .attr("dy", "0.71em")
      .attr("text-anchor", "middle")
      .style("font-size", "8px")
      .text("Percentages \u2192");

    // X-axis label
    g.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .style("font-size", `${Math.min(8, innerWidth / data.length)}px`)
      .text("Range \u2192");

    // Animation :- Rise from y-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "#000")
      .attr("y", 10)
      .attr("dy", "0.35em")
      .style("font-size", `${Math.min(6, innerWidth / data.length)}px`)
      .attr("text-anchor", "middle")
      .text((d) => d);

    // Highlighting of bar logic
    const isHighlighted = (label, userValueData) => {
      const [start, end] = label.split("-").map(Number);
      return userValueData >= start && userValueData <= end;
    };

    const updateBars = (highlightLabel) => {
      g.selectAll(".bar").attr("fill", (d) => {
        if (!highlightLabel && isHighlighted(d.label, userValueData)) {
          return "#1D9BCE";
        } else if (highlightLabel && d.label === highlightLabel) {
          return "#1D9BCE";
        } else {
          return "#3DD5F3";
        }
      });
    };

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", innerHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) =>
        isHighlighted(d.label, userValueData) ? "#1D9BCE" : "#3DD5F3"
      )
      .on("mouseover", function (event, d) {
        updateBars(d.label);
      })
      .on("mouseout", function (event, d) {
        updateBars(null);
      })
      .transition()
      .duration(2000)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerHeight - y(d.value));
  }, [data, yAxisLabels, xAxisLabels, width, height, userValueData]);

  return (
    <div
      className="bar-chart-container"
      style={{ width: "100%", height: `${height}px`, paddingLeft: "10px" }}
    >
      <svg ref={ref} width="100%" height="100%"></svg>
    </div>
  );
};

const MenuDashboard = () => {
  // Donut Chart properties
  const donutData = [
    { id: "1", Diabetic: 25, "Non-Diabetic": 75 },
    { id: "2", Risk: 25, Health: 75 },
    { id: "3", Risk: 25, Health: 75 },
    { id: "4", Risk: 25, Health: 75 },
    { id: "5", Risk: 25, Health: 75 },
    { id: "6", Risk: 25, Health: 75 },
    { id: "7", Risk: 25, Health: 75 },
    { id: "8", Risk: 25, Health: 75 },
  ];

  const features = [
    "Diabetic",
    "Feature 2",
    "Feature 3",
    "Feature 4",
    "Feature 5",
    "Feature 6",
    "Feature 7",
    "Feature 8",
  ];

  // Common properties for Line and Bar chart
  const percentages = [0, 25, 50, 75, 100];
  const percentageLabel = "Percentages";

  // Line Chart properties
  const peopleData = features.map(() => 25);
  const userData = [75, 35, 20, 50, 45, 85, 10, 95];
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
                <Col key={data.id} xs={6} className="chart-col">
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
