// src/services/productService.ts
import { ProductDetails } from "../hooks/useProductDetails";

export async function fetchProducts(token: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error fetching products");
  }

  return await res.json();
}

export async function fetchProductBySku(sku: string, token: string): Promise<ProductDetails> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${encodeURIComponent(sku)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo obtener el producto");
  return await res.json();
}

export async function deleteProductBySku(sku: string, token: string): Promise<void> {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/api/products/${sku}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error deleting product");
  }
}