/** @format */

import { DashboardStats, WordCloudItem } from "../types/dashboardTypes";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchDashboardStats(token: string): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/api/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener estadísticas del dashboard");
  }

  return await res.json();
}

export async function fetchWordCloudData(token: string): Promise<WordCloudItem[]> {
  const res = await fetch(`${API_URL}/api/dashboard/wordcloud`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener datos para la nube de productos");
  }

  return await res.json();
}

// Si más adelante necesitas agregar:
// - grouped sales por mes
// - datos para heatmap
// - tendencia de ventas del producto estrella
// ...puedes continuar esta estructura:


import { DataPoint } from "../components/LineChart";
import { MonthlyData } from "../components/types/comparisonChartTypes";

export async function fetchMonthlySales(token: string): Promise<DataPoint[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sales/summary/monthly-summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo obtener el resumen mensual");

  const json = await res.json();
  return json.map((item: any) => ({
    date: new Date(item.date),
    value: item.value,
  }));
}

export async function fetchSalesHeatmapData(token: string): Promise<number[][]> {
  const res = await fetch(`${API_URL}/api/dashboard/sales-activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener datos del heatmap de ventas");

  const json = await res.json();
  return json.data; // asegurarse que el backend envíe en esta forma
}

export async function fetchStarProductComparison(
  token: string,
): Promise<MonthlyData[]> {
  const res = await fetch(`${API_URL}/api/dashboard/star-product-comparison`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener comparación de producto estrella");
  return await res.json();
}

export interface StarProductResponse {
  name: string;
  total_value: number;
  monthly_comparison: MonthlyData[];
}

export const fetchStarProduct = async (token: string): Promise<StarProductResponse> => {

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/star-product`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener el producto estrella");
  }

  return await res.json();
};