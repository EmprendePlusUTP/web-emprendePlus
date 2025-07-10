// src/services/businessServices.ts


interface BusinessSettingsPayload {
  name: string;
  description: string;
  tagline: string;
  legal_name: string;
  tax_id: string;
  fiscal_address: string;
  phone: string;
  email: string;
  currency: string;
  invoice_prefix: string;
  invoice_counter: number;
  payment_terms_amount: number;
  payment_terms_unit: string;
  bank_details: string;
  tax_rates: string;
  timezone: string;
  language: string;
  date_format: string;
  number_format: string;
}

export const updateBusinessSettings = async (
  payload: BusinessSettingsPayload,
  token: string
) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/api/business/update-business/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("Error al actualizar negocio:", error);
    throw new Error("No se pudo actualizar la configuración del negocio");
  }

  return await response.json();
};


export const updateBusinessName = async (
  name: string,
  token: string,
  description?: string // opcional
) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const payload = {
    name,
    ...(description ? { description } : {}),
  };

  const response = await fetch(`${API_URL}/api/business/update-business/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error detail:", errorData);
    throw new Error("No se pudo actualizar el nombre del negocio.");
  }

  return await response.json();
};
