/** @format */

// src/pages/BusinessSettings.tsx
import React from "react";
import { useForm } from "react-hook-form";
import Modal from "../components/Modal"; 
import { useAuth0 } from "@auth0/auth0-react";
import { updateBusinessSettings } from "../services/businessServices";
import { toast } from "react-toastify";
import InvoicePDFPreview from "../components/InvoicePDFPreview";

type BusinessForm = {
  // 1. Identidad Básica
  name: string;
  tagline: string;
  logo: FileList;

  // 2. Datos Fiscales
  legalName: string;
  taxId: string;
  fiscalAddress: string;
  phone: string;
  email: string;

  // 3. Configuración de Facturación
  currency: string;
  invoicePrefix: string;
  invoiceCounter: number;
  paymentTermsAmount: number;
  paymentTermsUnit: string;
  bankDetails: string;
  taxRates: string; // e.g. "IVA:21%, IGV:18%"

  // 4. Ajustes Avanzados
  timezone: string;
  language: string;
  dateFormat: string;
  numberFormat: string;
};

export default function BusinessSettings() {
  const { getAccessTokenSilently } = useAuth0();
  const { register, handleSubmit, watch, formState } = useForm<BusinessForm>({
    defaultValues: {
      currency: "USD",
      invoicePrefix: "",
      invoiceCounter: 1,
      paymentTermsAmount: 30,
      paymentTermsUnit: "días",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: "es",
      dateFormat: "dd/mm/aaaa",
      numberFormat: "1.234,56",
    },
  });
  const [showPreview, setShowPreview] = React.useState(false);

  const onSubmit = async (data: BusinessForm) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });

      const payload = {
        name: data.name,
        description: data.tagline,
        tagline: data.tagline,
        legal_name: data.legalName,
        tax_id: data.taxId,
        fiscal_address: data.fiscalAddress,
        phone: data.phone,
        email: data.email,
        currency: data.currency,
        invoice_prefix: data.invoicePrefix, 
        invoice_counter: data.invoiceCounter, 
        payment_terms_amount: data.paymentTermsAmount,
        payment_terms_unit: data.paymentTermsUnit,
        bank_details: data.bankDetails,
        tax_rates: data.taxRates,
        timezone: data.timezone,
        language: data.language,
        date_format: data.dateFormat,
        number_format: data.numberFormat,
      };

      await updateBusinessSettings(payload, token);
      toast.success("Configuración guardada con éxito.");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al guardar los cambios");
    }
  };

  const logoFiles = watch("logo");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-neutral-800 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Configuración de Mi Emprendimiento
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 1. Identidad Básica */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              {...register("name", { required: true })}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tagline
            </label>
            <input
              {...register("tagline")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("logo")}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {logoFiles && logoFiles.length > 0 && (
              <img
                src={URL.createObjectURL(logoFiles[0])}
                alt="Logo preview"
                className="mt-2 h-20 object-contain"
              />
            )}
          </div>
        </section>

        {/* 2. Datos Fiscales */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Razón Social
            </label>
            <input
              {...register("legalName")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              NIF / CIF / RUC
            </label>
            <input
              {...register("taxId")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dirección Fiscal
            </label>
            <input
              {...register("fiscalAddress")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Teléfono
            </label>
            <input
              {...register("phone")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
        </section>

        {/* 3. Configuración de Facturación */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Moneda predeterminada
            </label>
            <select
              {...register("currency")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            >
              <option value="PAB">PAB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="PEN">PEN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prefijo de factura
            </label>
            <input
              placeholder="e.g. INV-"
              {...register("invoicePrefix")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contador inicial
            </label>
            <input
              type="number"
              {...register("invoiceCounter", { valueAsNumber: true })}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Términos de pago
            </label>
            <div className="flex gap-2">
              <div>
                <input
                  placeholder="Cantidad"
                  type="number"
                  {...register("paymentTermsAmount", { valueAsNumber: true })}
                  className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <select
                  {...register("paymentTermsUnit")}
                  className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                >
                  <option value="días">Días</option>
                  <option value="semanas">Semanas</option>
                  <option value="meses">Meses</option>
                </select>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Datos bancarios
            </label>
            <textarea
              {...register("bankDetails")}
              rows={2}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Impuestos aplicables
            </label>
            <input
              {...register("taxRates")}
              placeholder="e.g. IVA:21%, IGV:18%"
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            ▶ Ver preview de factura
          </button>
        </section>

        {/* 4. Ajustes Avanzados */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Zona horaria
            </label>
            <input
              {...register("timezone")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Idioma
            </label>
            <select
              {...register("language")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formato de fecha
            </label>
            <input
              {...register("dateFormat")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formato de número
            </label>
            <input
              {...register("numberFormat")}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
        </section>

        {/* Botones */}
        <div className="pt-4 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              /* reset o navigate */
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>

      {/* Modal de preview de factura */}
      {showPreview && (
        <Modal onClose={() => setShowPreview(false)}>
          {/* Aquí renderizas un PDF o imagen de la plantilla */}
          <InvoicePDFPreview />

        </Modal>
      )}
    </div>
  );
}
