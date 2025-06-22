/** @format */

// src/pages/OrderDetail.tsx
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // en un caso real harías fetch( `/api/orders/${id}` )…
  return (
    <div className="space-y-4 max-w-lg">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
      >
        ← Volver
      </button>
      <h1 className="text-xl font-semibold">Detalle Pedido #{id}</h1>
      <p>
        <strong>Cliente:</strong> Ana Pérez
      </p>
      <p>
        <strong>Fecha:</strong> 2025-04-25
      </p>
      <p>
        <strong>Total:</strong> $59.99
      </p>
      <p>
        <strong>Estado:</strong> Pendiente
      </p>

      <h2 className="text-lg font-medium mt-4">Productos</h2>
      <ul className="list-disc ps-5 space-y-1">
        <li>Camiseta x2 — $39.98</li>
        <li>Gorra x1 — $9.99</li>
      </ul>

      <div className="mt-4">
        <button className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 me-2">
          Marcar como Enviado
        </button>
        <button className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700">
          Cancelar Pedido
        </button>
      </div>
    </div>
  );
}
