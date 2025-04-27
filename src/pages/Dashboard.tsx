// src/pages/Dashboard.tsx
import ChangeBadge from "../components/ChangeBadge";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";
import { Column } from "../components/BaseTable";
import GroupedBarChart, { MonthlyData } from "../components/GroupedBarChart";
import LineChart, { DataPoint } from "../components/LineChart";
import StatsCard from "../components/StatsCard";
import TableCard from "../components/TableCard";

export default function Dashboard() {
  const starProductSales: MonthlyData[] = [
    { month: "Jan", primary: 1500, secondary: 2233 },
    { month: "Feb", primary: 1800, secondary: 4332 },
    { month: "Mar", primary: 2100, secondary: 562 },
    { month: "Apr", primary: 1700, secondary: 324 },
    { month: "May", primary: 2200, secondary: 5465 },
    { month: "Jun", primary: 2000, secondary: 231 },
    { month: "Jul", primary: 2400, secondary: 2343 },
    { month: "Aug", primary: 2300, secondary: 2343 },
    { month: "Sep", primary: 2500, secondary: 5456 },
    { month: "Oct", primary: 2700, secondary: 114 },
    { month: "Nov", primary: 2600, secondary: 3142 },
    { month: "Dec", primary: 3000, secondary: 4335 },
  ];
  const monthlySales: DataPoint[] = [
    { date: new Date(2025, 0, 1), value: 12000 },
    { date: new Date(2025, 1, 1), value: 15000 },
    { date: new Date(2025, 2, 1), value: 18000 },
    { date: new Date(2025, 3, 1), value: 14000 },
    { date: new Date(2025, 4, 1), value: 20000 },
    { date: new Date(2025, 5, 1), value: 22000 },
  ];
  // --- 1. Métricas de alto nivel ---
  const stats = [
    {
      title: "Ingresos totales",
      tooltip: "Ingresos generados en el mes",
      value: "$34,782",
      change: "12.5",
    },
    {
      title: "Órdenes totales",
      tooltip: "Órdenes recibidas este mes",
      value: "1,245",
    },
    {
      title: "Clientes nuevos",
      tooltip: "Nuevos compradores este mes",
      value: "342",
      change: "8.1",
    },
    {
      title: "Tasa de conversión",
      tooltip: "Visitas que terminan en compra",
      value: "3.8%",
      change: "-0.4",
    },
  ];

  // --- 2. Definición de la tabla de pedidos ---
  type Order = {
    orderId: string;
    customer: string;
    total: string;
    status: string;
    date: string;
  };

  const orderColumns: Column<Order>[] = [
    { key: "orderId", header: "ID Orden" },
    { key: "customer", header: "Cliente" },
    { key: "total", header: "Total" },
    { key: "status", header: "Estado" },
    { key: "date", header: "Fecha" },
  ];

  const orders: Order[] = [
    {
      orderId: "#1001",
      customer: "Ana Gómez",
      total: "$128.50",
      status: "Completada",
      date: "2025-04-20",
    },
    {
      orderId: "#1002",
      customer: "Luis Pérez",
      total: "$76.00",
      status: "Pendiente",
      date: "2025-04-21",
    },
    {
      orderId: "#1003",
      customer: "María Ruiz",
      total: "$210.99",
      status: "Envío",
      date: "2025-04-22",
    },
    {
      orderId: "#1004",
      customer: "Carlos Díaz",
      total: "$45.00",
      status: "Cancelada",
      date: "2025-04-22",
    },
    {
      orderId: "#1005",
      customer: "Sofía Torres",
      total: "$99.99",
      status: "Completada",
      date: "2025-04-23",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* --- Métricas rápidas --- */}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* --- Gráfico de ventas mensuales --- */}
        <ChartCard
          title="Ventas mensuales"
          value="$34,782"
          changeBadge={<ChangeBadge percent={12.5} />}
        >
          <LineChart data={monthlySales} />
        </ChartCard>
        <ChartCard
          title="Producto Estrella: Gorra"
          value="$34,782"
          changeBadge={<ChangeBadge percent={12.5} />}
        >
          <GroupedBarChart data={starProductSales} />
        </ChartCard>
      </div>

      {/* --- Tabla de pedidos recientes --- */}
      <TableCard>
        <DataTable
          columns={orderColumns}
          data={orders}
          title="Órdenes Recientes"
        />
      </TableCard>
    </div>
  );
}
