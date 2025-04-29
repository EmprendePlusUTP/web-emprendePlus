// src/services/advisor.ts

export interface AdvisorRequest {
  user_id: string;
  user_name: string;
  currency: string;
  product_list: {
    id: string;
    name: string;
    monthly_sales: number;
    supplier: string;
    stock: number;
  }[];
  business_name: string;
  sales_history: Record<string, number>;
  top_product: string;
  message: string;
}
const API = import.meta.env.VITE_API_URL;
export async function askAdvisor(body: AdvisorRequest): Promise<string> {
  const res = await fetch(`${API}/advisor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error del asesor");
  const { reply } = await res.json();
  return reply as string;
}
