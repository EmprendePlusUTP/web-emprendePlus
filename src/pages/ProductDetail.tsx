// src/pages/ProductPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Pencil } from "lucide-react";
type FormData = {
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  cost: number;
  discount?: number;
  stock: number;
  minStockAlert: number;
  supplier: string;
  status: "active" | "draft" | "archived";
  color: string;
  dimensions: { width: number; height: number; depth: number };
  weight: number;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
  rating?: number;
};

type Product = FormData & { id: string; imageUrl?: string };

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues: {} as FormData });

  // Editable name and SKU
  const [editingName, setEditingName] = useState(isNew);
  const [nameValue, setNameValue] = useState("");
  const [skuValue, setSkuValue] = useState("");

  // Load or init
  useEffect(() => {
    if (isNew) {
      reset({
        sku: "",
        name: "",
        slug: "",
        description: "",
        category: "",
        tags: [],
        price: 0,
        cost: 0,
        discount: 0,
        stock: 0,
        minStockAlert: 0,
        supplier: "",
        status: "active",
        color: "",
        dimensions: { width: 0, height: 0, depth: 0 },
        weight: 0,
        taxRate: 0,
        createdAt: "",
        updatedAt: "",
      });
      setEditingName(true);
      setNameValue("");
      setSkuValue("");
      setPreviewUrl(undefined);
      setLoading(false);
      return;
    }
    // Mock fetch
    const mock: Product = {
      id: id || "",
      sku: "SKU123",
      name: "Camiseta",
      slug: "camiseta",
      description: "Descripción detallada del producto.",
      category: "Ropa",
      tags: ["moda", "verano"],
      price: 19.99,
      cost: 10,
      discount: 0,
      stock: 120,
      minStockAlert: 10,
      supplier: "Proveedor A",
      status: "active",
      color: "Navy",
      dimensions: { width: 10, height: 20, depth: 5 },
      weight: 0.5,
      taxRate: 0.21,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.5,
      imageUrl: "/img/camiseta.jpg",
    };
    setProduct(mock);
    reset(mock);
    setNameValue(mock.name);
    setSkuValue(mock.sku);
    setPreviewUrl(mock.imageUrl);
    setLoading(false);
  }, [id, isNew, reset]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setPreviewUrl(URL.createObjectURL(file));
    },
    []
  );

  const onSubmit = (data: FormData) => {
    console.log(isNew ? "Crear producto" : "Guardar producto", data);
    navigate("/products");
  };

  if (loading) return <p>Cargando...</p>;
  if (!product && !isNew) return <p>Producto no encontrado</p>;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-xl shadow">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Volver
      </button>

      {/* Nombre con lápiz */}
      <div className="flex items-center mb-6">
        {editingName ? (
          <input
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              setValue("name", nameValue);
            }}
            placeholder="Nombre del producto"
            className="text-3xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-300 focus:outline-none"
          />
        ) : (
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mr-2">
            {nameValue}
          </h1>
        )}
        {!editingName && (
          <span onClick={() => setEditingName(true)} className="cursor-pointer text-gray-500 dark:text-gray-200 dark:hover:text-gray-400">
            <Pencil />
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Imagen principal y upload */}
          <div className="space-y-4">
            <div className="rounded-md overflow-hidden border border-gray-200 dark:border-neutral-700">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={nameValue}
                  className="w-full object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-400 dark:text-neutral-500">
                  No hay imagen
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="upload-image"
              />
              <label
                htmlFor="upload-image"
                className="py-2 px-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Cambiar imagen
              </label>
            </div>
          </div>

          {/* Info segments */}
          <div className="lg:col-span-2 space-y-6">
            {/* SKU y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  SKU
                </label>
                <input
                  value={skuValue}
                  onChange={(e) => setSkuValue(e.target.value)}
                  onBlur={() => {
                    const original = product?.sku || "";
                    if (skuValue !== original) {
                      if (window.confirm("¿Seguro que deseas cambiar el SKU?"))
                        setValue("sku", skuValue);
                      else setSkuValue(original);
                    }
                  }}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Estado
                </label>
                <select
                  {...register("status")}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                >
                  <option value="active">Activo</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Descripción
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            {/* Precios e inventario */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Coste
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("cost", { valueAsNumber: true })}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Descuento %
                </label>
                <input
                  type="number"
                  {...register("discount", { valueAsNumber: true })}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Stock
                </label>
                <input
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Alerta mínimo
                </label>
                <input
                  type="number"
                  {...register("minStockAlert", { valueAsNumber: true })}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
            </div>

            {/* Dimensiones, peso, impuestos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Dimensiones (cm)
                </label>
                <div className="flex space-x-2 mt-1">
                  <input
                    type="number"
                    placeholder="Ancho"
                    {...register("dimensions.width", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Alto"
                    {...register("dimensions.height", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Prof."
                    {...register("dimensions.depth", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("weight", { valueAsNumber: true })}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Impuesto (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("taxRate", { valueAsNumber: true })}
                  className="mt-1 w-full border border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
            </div>

            {/* Botones finales */}
            <div className="pt-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
