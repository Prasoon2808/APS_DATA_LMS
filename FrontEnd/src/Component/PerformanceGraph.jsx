import React from "react";
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// Sample data
const data = [
  { subject: "Design", A: 120 },
  { subject: "Code", A: 98 },
  { subject: "Performance", A: 86 },
  { subject: "UX", A: 99 },
  { subject: "Accessibility", A: 85 },
];

// Custom legend component
const CustomLegend = ({ data }) => (
  <div style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}>
    {data.map((entry, index) => (
      <div key={index} style={{ marginBottom: 4 }}>
        <span style={{ fontWeight: "bold" }}>{entry.subject}:</span> {entry.A}
      </div>
    ))}
  </div>
);

const PerformanceGraph = () => {
  return (
    <div
      style={{
        width: "100%",
        height: 350,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxSizing: "border-box"
      }}
    >
      {/* Left Heading */}
      <div style={{ width: "100px", height: "100%", display: "flex", alignItems: "flex-start" }}>
        <p style={{ margin: 0, fontSize: "16px", marginTop: 10, fontWeight: "500" }}>Performance</p>
      </div>

      {/* Radar Chart */}
      <RadarChart
        cx={240}
        cy={190}
        outerRadius={150}
        width={500}
        height={350}
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>

      {/* Right Legend */}
      <CustomLegend data={data} />
    </div>
  );
};

export default PerformanceGraph;
