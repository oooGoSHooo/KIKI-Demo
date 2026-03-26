import React from "react";

export const RADAR_DATA = [
  { subject: "听力", grade: "C", A: 20, fullMark: 100 },
  { subject: "口语", grade: "A", A: 80, fullMark: 100 },
  { subject: "阅读", grade: "B-", A: 30, fullMark: 100 },
  { subject: "写作", grade: "B", A: 40, fullMark: 100 },
  { subject: "词汇", grade: "B+", A: 60, fullMark: 100 },
  { subject: "语法", grade: "B", A: 50, fullMark: 100 },
  { subject: "发音", grade: "A-", A: 70, fullMark: 100 },
  { subject: "拼写", grade: "C+", A: 25, fullMark: 100 },
];

export const CustomPolarGrid = ({ cx, cy, polarRadius, polarAngles }: any) => {
  if (!polarRadius || !polarAngles) return null;
  const maxRadius = Math.max(...polarRadius);
  const step = maxRadius / 4;
  return (
    <g>
      <circle cx={cx} cy={cy} r={step * 4} fill="#fff7ed" stroke="none" />
      <circle cx={cx} cy={cy} r={step * 3} fill="#ffedd5" stroke="none" />
      <circle cx={cx} cy={cy} r={step * 2} fill="#fed7aa" stroke="none" />
      <circle cx={cx} cy={cy} r={step * 1} fill="#fdba74" stroke="none" />
      {polarAngles.map((angle: number, index: number) => {
        const rad = (-angle * Math.PI) / 180;
        const x = cx + maxRadius * Math.cos(rad);
        const y = cy + maxRadius * Math.sin(rad);
        return (
          <line
            key={index}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#fdba74"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      })}
    </g>
  );
};

export const CustomTick = ({ payload, x, y, textAnchor, stroke, radius }: any) => {
  const dataItem = RADAR_DATA.find((item) => item.subject === payload.value);
  return (
    <g className="recharts-layer recharts-polar-angle-axis-tick">
      <text
        radius={radius}
        stroke={stroke}
        x={x}
        y={y}
        className="recharts-text recharts-polar-angle-axis-tick-value"
        textAnchor={textAnchor}
      >
        <tspan x={x} dy="-0.2em" fill="#4b5563" fontSize="14" fontWeight="bold">
          {payload.value}
        </tspan>
        <tspan x={x} dy="1.4em" fill="#f97316" fontSize="14" fontWeight="bold">
          {dataItem?.grade}
        </tspan>
      </text>
    </g>
  );
};
