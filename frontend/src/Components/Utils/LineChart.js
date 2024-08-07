import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import '../../StyleSheets/DashboardMenu.css';

// Render a Line Chart component facilitating 2 line data
// Props - x axis and y axis labels
// data for line 1 and line 2
const LineChart = ({ xAxisLabels, yAxisLabels, lineData1, lineData2, xAxisLabel, yAxisLabel }) => {
    const ref = useRef();
  
    useEffect(() => {
      // set size stylings for the line chart
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); // remove previous trailing drawings
  
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const containerWidth = ref.current.parentElement.clientWidth;
      const width = containerWidth - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
  
      const g = svg
        .attr("width", containerWidth)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // X-axis properties
      const x = d3
        .scalePoint()
        .domain(xAxisLabels)
        .padding(0.5)
        .range([0, width]);
  
      // Y-axis properties
      const y = d3
        .scaleLinear()
        .domain([0, 100])
        .range([height, 0]);
  
      const line = d3
        .line()
        .x((d, i) => x(xAxisLabels[i]))
        .y((d) => y(d));
  
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .style("font-size", `${Math.min(6, width / xAxisLabels.length)}px`); // Font size reduces based on window width to fit in
  
      g.append("g")
        .call(d3.axisLeft(y).tickValues(yAxisLabels));
  
      // Path 1 properties
      const path1 = g.append("path")
        .datum(lineData1)
        .attr("fill", "none")
        .attr("stroke", "#3DD5F3")
        .attr("stroke-width", 3)
        .attr("d", line);
  
      const totalLengthPath1 = path1.node().getTotalLength();
  
      path1
        .attr("stroke-dasharray", `${totalLengthPath1} ${totalLengthPath1}`)
        .attr("stroke-dashoffset", totalLengthPath1)
        // START: Animation
        .transition()
        .duration(2000)
        .ease(d3.easeLinear) // Draw through the path linearly
        .attr("stroke-dashoffset", 0);
        // END: Animation in 2 seconds
  
      // Path 2 properties
      const path2 = g.append("path")
        .datum(lineData2)
        .attr("fill", "none")
        .attr("stroke", "#1D9BCE")
        .attr("stroke-width", 3)
        .attr("d", line);
  
      const totalLengthPath2 = path2.node().getTotalLength();
  
      path2
        .attr("stroke-dasharray", `${totalLengthPath2} ${totalLengthPath2}`)
        .attr("stroke-dashoffset", totalLengthPath2)
        // START: Animation
        .transition()
        .duration(2000)
        .ease(d3.easeLinear) // Draw through the path linearly
        .attr("stroke-dashoffset", 0);
        // END: Animation in 2 seconds
  
      // Plot dots in the coordinates properties
      const addDots = (data, className, color) => {
        g.selectAll(`.${className}`)
          .data(data)
          .enter()
          .append("circle")
          .attr("class", className)
          .attr("cx", (d, i) => x(xAxisLabels[i]))
          .attr("cy", (d) => y(d))
          .attr("r", 4)
          .attr("fill", color)
          .attr("opacity", 0)
          .transition()
          .delay((d, i) => (i + 1) * (2000 / xAxisLabels.length))
          .duration(500)
          .attr("opacity", 1);
      };
  
      addDots(lineData1, "dot-people", "#3DD5F3");
      addDots(lineData2, "dot-user", "#1D9BCE");
  
      // X-axis label
      svg.append("text")
        .attr("transform", `translate(${width / 2 + margin.left},${height + margin.top + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .style("font-size", `${Math.min(8, width / xAxisLabels.length)}px`)
        .text(xAxisLabel + "\u2192");
  
      // Y-axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 32)
        .attr("x", 0 - (height / 2) - margin.top)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .text(yAxisLabel + "\u2192");
  
    }, [xAxisLabels, yAxisLabels, lineData1, lineData2, xAxisLabel, yAxisLabel]);
  
    return (
      <div className="line-chart-container">
        <svg ref={ref}></svg>
      </div>
    );
  };

export default LineChart;