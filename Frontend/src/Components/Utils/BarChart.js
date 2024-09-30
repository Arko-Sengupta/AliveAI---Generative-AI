import * as d3 from "d3";
import { useEffect, useRef } from "react";
import "../../StyleSheets/DashboardMenu.css";

const BarChart = ({
  data,
  yAxisLabels,
  xAxisLabels,
  userValueData,
  width = 400,
  height = 300,
}) => {
  const ref = useRef();
  const hasAnimated = useRef(true);
  const currentHeight = useRef(height);

  const handleResize = () => {
    if (window.matchMedia("(max-width: 480px)").matches) {
      currentHeight.current = 200;
    } else {
      currentHeight.current = 300;
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const drawChart = (svg, innerWidth, innerHeight, x, y, margin) => {
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yAxis = d3
      .axisLeft(y)
      .tickValues(yAxisLabels)
      .tickFormat((d) => `${d}`);

    g.append("g").call(yAxis);

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

    g.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .style("font-size", `${Math.min(8, innerWidth / data.length)}px`)
      .text("Range \u2192");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "#000")
      .attr("y", 10)
      .attr("dy", "0.35em")
      .style("font-size", `${Math.min(6, innerWidth / data.length)}px`)
      .attr("text-anchor", "middle");

    return g;
  };

  const animateBars = (bars, innerHeight, y) => {
    hasAnimated.current = false;
    bars
      .attr("y", innerHeight)
      .attr("height", 0)
      .transition()
      .duration(2000)
      .delay((d, i) => i * 100)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerHeight - y(d.value));
  };

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 30 };
    const containerWidth = ref.current.parentElement.clientWidth;
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = currentHeight.current - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(xAxisLabels)
      .range([0, innerWidth])
      .padding(0.4);

    const y = d3.scaleLinear().domain([0, 100]).nice().range([innerHeight, 0]);

    const g = drawChart(svg, innerWidth, innerHeight, x, y, margin);

    const bars = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("width", x.bandwidth())
      .attr("fill", (d) =>
        isHighlighted(d.label, userValueData) ? "#1D9BCE" : "#3DD5F3"
      );

    if (hasAnimated.current) {
      setTimeout(() => animateBars(bars, innerHeight, y), 0);
    } else {
      bars
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => innerHeight - y(d.value));
    }
  }, [data, yAxisLabels, xAxisLabels, width, userValueData]);

  const isHighlighted = (label, userValueData) => {
    const [start, end] = label.split("-").map(Number);
    return userValueData >= start && userValueData <= end;
  };

  return (
    <div
      className="bar-chart-container"
      style={{
        width: "100%",
        height: `${currentHeight.current}px`,
        paddingLeft: "10px",
      }}
    >
      <svg ref={ref} width="100%" height="100%"></svg>
    </div>
  );
};

export default BarChart;
