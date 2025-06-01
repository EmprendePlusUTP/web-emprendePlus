// src/components/finances/MonthlyTrendsChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type MonthlyData = {
  month: string; // e.g. "2025-01"
  income: number;
  expense: number;
  net: number;
};

type Props = {
  data: MonthlyData[];
};

export const MonthlyTrendsChart = ({ data }: Props) => {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-neutral-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-100 mb-4">
        Tendencia Mensual
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#4B5563", fillOpacity: 0.8 }}
            stroke="#D1D5DB"
            tickFormatter={(val) => val.replace("-", "/")}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#4B5563", fillOpacity: 0.8 }}
            stroke="#D1D5DB"
          />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString("es-PA")}`}
            contentStyle={{ backgroundColor: "#FFFFFF", border: "none" }}
            cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: "#6B7280" }} />
          <Line
            type="monotone"
            dataKey="income"
            name="Ingresos"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Gastos"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Ganancia Neta"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
