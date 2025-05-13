// src/pages/ProductView.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { Column } from "../components/BaseTable";
import ProductCard, { Product } from "../components/ProductCard";
import ViewToggleButton from "./ViewToggleButton";
import { GalleryHorizontalEnd, List } from "lucide-react";
import TableCard from "../components/TableCard";
import fetchProducts from "../services/producs" 

export default function Products() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  
  // Columnas para la vista de listado
  const columns: Column<Product>[] = [
    { key: "name", header: "Nombre" },
    {
      key: "price",
      header: "Precio",
      render: (p) => `$${p.price.toFixed(2)}`,
    },
    {
      key: "stock",
      header: "Inventario",
      render: (p) => p.stock || 0,
    },
    {
      key: "id",
      header: "Acciones",
      render: (p) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => navigate(`/products/${p.id}`)}
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-gray-800 dark:text-neutral-200">
      {/* Header con toggle y botón de “Nuevo” */}
      <div className="flex justify-end items-center ">
        <div className="flex items-center gap-3">
          <ViewToggleButton
            viewType="list"
            label="Lista"
            currentView={viewMode}
            onClick={() => setViewMode("list")}
            icon={<List size={20} />}
          />
          <ViewToggleButton
            viewType="grid"
            label="Galería"
            currentView={viewMode}
            onClick={() => setViewMode("grid")}
            icon={<GalleryHorizontalEnd size={20} />}
          />
        </div>
      </div>

      {/* Contenido según vista */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <TableCard>
            <DataTable
              title="Productos"
              toolbar={
                <button
                  onClick={() => navigate("/products/new")}
                  className="py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Nuevo Producto
                </button>
              }
              columns={columns}
              data={products}
            />
          </TableCard>
        </div>
      )}
    </div>
  );
}
