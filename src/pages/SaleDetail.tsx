/** @format */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchSaleById } from "../services/salesServices";
import { DetailedSale } from "../types/saleTypes";
import TableCard from "../components/TableCard";
import DataTable from "../components/DataTable";
import { Column } from "../components/BaseTable";

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [sale, setSale] = useState<DetailedSale | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isAuthenticated || !id) return;
        const token = await getAccessTokenSilently();
        const data = await fetchSaleById(id, token);
        setSale(data);
      } catch (e) {
        console.error("Error loading sale", e);
      }
    };

    load();
  }, [id, isAuthenticated]);

  const productColumns: Column<DetailedSale["products"][number]>[] = [
    {
      key: "name",
      header: "Producto",
    },
    {
      key: "sku",
      header: "SKU",
    },
    {
      key: "quantity",
      header: "Cantidad",
      render: (p) => p.quantity.toString(),
    },
    {
      key: "price",
      header: "Precio Unitario",
      render: (p) => `$${p.price.toFixed(2)}`,
    },
    {
      key: "discount",
      header: "Descuento",
      render: (p) =>
        p.discount !== undefined && p.discount > 0
          ? `${(p.discount * 100).toFixed(0)}%`
          : "—",
    },
    {
      key: "subtotal",
      header: "Subtotal",
      render: (p) => `$${p.subtotal.toFixed(2)}`,
    },
  ];

  if (!sale) {
    return <p className="text-center text-gray-500">Cargando venta...</p>;
  }

  return (
    <div className="space-y-6 text-gray-800 dark:text-neutral-200">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Venta #{sale.sale_id}</h1>
        <button
          onClick={() => navigate("/sales")}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
        >
          ← Volver a Ventas
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <strong>Fecha:</strong>{" "}
          {new Date(sale.sale_date).toLocaleDateString()}
        </div>
        <div>
          <strong>Total:</strong> ${sale.total.toFixed(2)}
        </div>
      </div>

      <TableCard>
        <DataTable
          title="Productos Vendidos"
          columns={productColumns}
          data={sale.products}
        />
      </TableCard>
    </div>
  );
}
