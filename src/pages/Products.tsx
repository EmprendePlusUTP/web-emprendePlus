// src/pages/ProductView.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { Column } from "../components/BaseTable";
import ProductCard, { Product } from "../components/ProductCard";
import ViewToggleButton from "./ViewToggleButton";
import { GalleryHorizontalEnd, List } from "lucide-react";
import TableCard from "../components/TableCard";
import { deleteProductBySku, fetchProducts } from "../services/productServices";
import { useAuth0 } from "@auth0/auth0-react";


export default function Products() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const navigate = useNavigate();

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isAuthenticated) return;
        const token = await getAccessTokenSilently();
        const data = await fetchProducts(token);
        setProducts(data);
      } catch (e) {
        console.error("Error loading products", e);
      }
    };

    load();
  }, [isAuthenticated]);

  // Columnas para la vista de listado
  const columns: Column<Product>[] = [
    { key: "name", header: "Nombre" },
    {
      key: "sale_price",
      header: "Precio",
      render: (p) => `$${p.sale_price.toFixed(2)}`,
    },
    {
      key: "stock",
      header: "Inventario",
      render: (p) => p.stock || 0,
    },
    {
  key: "sku",
  header: "Acciones",
  render: (p) => (
    <div className="flex space-x-3">
      <button
        className="text-blue-600 hover:underline"
        onClick={() => navigate(`/products/${p.sku}`)}
      >
        Editar
      </button>
      <button
        className="text-red-600 hover:underline"
        onClick={async () => {
          const confirm = window.confirm(`¿Eliminar producto "${p.name}"?`);
          if (!confirm) return;

          try {
            const token = await getAccessTokenSilently();
            await deleteProductBySku(p.sku, token);
            setProducts((prev) => prev.filter((prod) => prod.sku !== p.sku));
          } catch (err) {
            console.error("Error deleting product", err);
            alert("Error eliminando el producto");
          }
        }}
      >
        Eliminar
      </button>
    </div>
  ),
}
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
            <ProductCard key={p.sku} product={p} />
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
