import { Product } from "../schema/product";

  
const API_URL = import.meta.env.VITE_API_URL;

async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/test/productos`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json() as Product[]; // Type assertion here
    return data;
  }


export default fetchProducts
