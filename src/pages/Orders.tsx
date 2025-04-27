// src/pages/Sales.tsx
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import { Column } from "../components/BaseTable";
import TableCard from "../components/TableCard";

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "cancelled";
};

type Sale = {
  product: string;
  sku: string;
  quantity: number;
  revenue: number;
  date: string;
};

const mockOrders: Order[] = [
  {
    id: "1001",
    customer: "Ana Pérez",
    date: "2025-04-25",
    total: 59.99,
    status: "pending",
  },
  {
    id: "1002",
    customer: "Luis Gómez",
    date: "2025-04-24",
    total: 129.5,
    status: "shipped",
  },
  // …
];

const mockSales: Sale[] = [
  {
    product: "Camiseta Azul",
    sku: "SKU123",
    quantity: 12,
    revenue: 239.88,
    date: "2025-04-25",
  },
  {
    product: "Gorra Roja",
    sku: "SKU456",
    quantity: 5,
    revenue: 99.95,
    date: "2025-04-24",
  },
  // …
];

export default function Sales() {
  const navigate = useNavigate();

  // Métricas del mes actual (mock)
  const stats = [
    {
      title: "Ingresos del mes",
      value: "$12,345.67",
      change: "3.5",
    },
    {
      title: "Órdenes procesadas",
      value: "124",
      change: "5.2",
    },
    {
      title: "Valor medio",
      value: "$99.56",
    },
    {
      title: "Artículos vendidos",
      value: "537",
      change: "2.5",
    },
  ];

  // Columnas para la tabla de Pedidos
  const orderColumns: Column<Order>[] = [
    { key: "id", header: "Pedido #" },
    { key: "customer", header: "Cliente" },
    { key: "date", header: "Fecha" },
    {
      key: "total",
      header: "Total",
      render: (o) => `$${o.total.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Estado",
      render: (o) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            o.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : o.status === "shipped"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {o.status}
        </span>
      ),
    },
    {
      key: "id",
      header: "Acciones",
      render: (o) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          Ver
        </button>
      ),
    },
  ];

  // Columnas para la tabla de Ventas por producto
  const salesColumns: Column<Sale>[] = [
    { key: "product", header: "Producto" },
    { key: "sku", header: "SKU" },
    {
      key: "quantity",
      header: "Cant.",
      render: (s) => s.quantity.toString(),
    },
    {
      key: "revenue",
      header: "Ingresos",
      render: (s) => `$${s.revenue.toFixed(2)}`,
    },
    { key: "date", header: "Fecha" },
  ];

  return (
    <div className="space-y-8">
      {/* Estadísticas del mes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>

      {/* Tabla de Pedidos */}
      <section className="space-y-4">
        <TableCard>
          <DataTable<Order>
            columns={orderColumns}
            data={mockOrders}
            toolbar={
              <button
                onClick={() => navigate("/orders/new")}
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Nuevo Pedido
              </button>
            }
            title="Órdenes Recientes"
          />
        </TableCard>
      </section>

      {/* Tabla de Ventas */}

      <TableCard>
        <DataTable columns={salesColumns} data={mockSales} title="Ventas por Producto" />
      </TableCard>
    </div>
  );
}
