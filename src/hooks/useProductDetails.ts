import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Product } from "../components/ProductCard";
import { fetchProductBySku } from "../services/productServices";

export type ProductDetails = {
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  sale_price: number;
  cost: number;
  discount?: number;
  stock: number;
  min_stock_alert: number;
  supplier: string;
  status: "active" | "draft" | "archived";
  color: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  tax_rate: number;
  created_at: string;
  updated_at: string;
  rating?: number;
  imageUrl?: string;
};


export function useProductDetails(sku: string) {
  const { getAccessTokenSilently } = useAuth0();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getAccessTokenSilently();
        const result = await fetchProductBySku(sku, token);
        setProduct(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sku) load();
  }, [sku]);

  return { product, loading };
}