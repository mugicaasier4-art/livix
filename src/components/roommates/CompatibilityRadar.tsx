import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface CompatibilityRadarProps {
  breakdown: { dimension: string; label: string; score: number }[];
  size?: number;
}

const CompatibilityRadar = ({ breakdown, size = 300 }: CompatibilityRadarProps) => {
  if (!breakdown || breakdown.length === 0) return null;

  const data = breakdown.map((item) => ({
    subject: item.label,
    value: item.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#000", fontSize: 12, fontFamily: "Poppins" }}
        />
        <Radar
          name="Compatibilidad"
          dataKey="value"
          stroke="#5DB4EE"
          fill="#5DB4EE"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CompatibilityRadar;
