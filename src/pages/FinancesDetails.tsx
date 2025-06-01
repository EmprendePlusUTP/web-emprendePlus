// src/pages/FinancesDetails.tsx
import { useState, useEffect, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import { useNavigate } from "react-router-dom";

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ChartCard from "../components/ChartCard";
import SunburstChart from "../components/SunBurstChart";
import { sunburstData } from "../data/SunburstData/sunburstData";
import { RadarChart } from "echarts/charts";

// 1) Registramos los componentes que necesitamos
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer,
]);
// 2) Registramos el tema “dark”

const FinancesDetails = () => {
  // Detectar modo oscuro
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    setIsDark(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Indicadores (ejes del radar)
  const indicators = useMemo(
    () => [
      { name: "Ventas", max: 6500 },
      { name: "Administración", max: 16000 },
      { name: "Tecnología de la Información", max: 30000 },
      { name: "Atención al Cliente", max: 38000 },
      { name: "Desarrollo", max: 52000 },
      { name: "Mercadeo", max: 25000 },
    ],
    []
  );

  // Datos de ejemplo: presupuestado vs gastado
  const budgetValues = [4200, 3000, 20000, 35000, 50000, 18000];
  const spendingValues = [5000, 14000, 28000, 26000, 42000, 21000];

  // Construir la opción para ECharts
  const option = useMemo<echarts.EChartsCoreOption>(
    () => ({
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      title: {
        text: "Presupuesto vs Gastado",
        left: "center",
        textStyle: {
          color: isDark ? "#F3F4F6" : "#1F2937",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        data: ["Presupuesto Asignado", "Gasto Real"],
        bottom: 0,
        textStyle: {
          color: isDark ? "#D1D5DB" : "#374151",
        },
      },
      radar: {
        indicator: indicators.map((ind) => ({
          name: ind.name,
          max: ind.max,
        })),
        shape: "polygon",
        splitNumber: 5,
        axisName: {
          color: isDark ? "#E5E7EB" : "#4B5563",
        },
        splitLine: {
          lineStyle: {
            color: isDark
              ? ["rgba(226,232,240, 0.15)"]
              : ["rgba(156,163,175, 0.3)"],
          },
        },
        splitArea: {
          areaStyle: {
            color: isDark
              ? ["rgba(30,41,59,0.0)", "rgba(30,41,59,0.1)"]
              : ["rgba(248,250,252,0.0)", "rgba(248,250,252,0.5)"],
          },
        },
        axisLine: {
          lineStyle: {
            color: isDark ? "rgba(226,232,240,0.5)" : "rgba(156,163,175,0.5)",
          },
        },
      },
      series: [
        {
          name: "Presupuesto vs Gasto",
          type: "radar",
          data: [
            {
              value: budgetValues,
              name: "Presupuesto Asignado",
              areaStyle: {
                opacity: 0.2,
                color: isDark ? "#10B981" : "#10B981",
              },
            },
            {
              value: spendingValues,
              name: "Gasto Real",
              areaStyle: {
                opacity: 0.2,
                color: isDark ? "#EF4444" : "#EF4444",
              },
            },
          ],
          lineStyle: {
            width: 2,
          },
          emphasis: {
            lineStyle: {
              width: 3,
            },
          },
        },
      ],
    }),
    [isDark, indicators, budgetValues, spendingValues]
  );

  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-neutral-100">
      <button
        className="mb-4 px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-neutral-100 hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>
      <h1 className="text-2xl font-bold mb-4">Detalles de Finanzas</h1>
      <p className="mb-4">
        Aquí podrás ver un desglose detallado de tus finanzas, análisis
        avanzados y más información relevante.
      </p>

      {/* Radar comparando presupuestado vs gastado */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 mt-6 border border-gray-200 dark:border-neutral-700">
        <ReactECharts
          echarts={echarts}
          option={option}
          style={{ width: "100%", height: 400 }}
          theme={isDark ? "dark" : undefined}
        />
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 mt-6 border border-gray-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold mb-2">Próximamente</h2>
        <p>Esta sección mostrará detalles avanzados de tus finanzas.</p>

        <ChartCard>
          <SunburstChart data={sunburstData} />
        </ChartCard>
      </div>
    </div>
  );
};

export default FinancesDetails;
