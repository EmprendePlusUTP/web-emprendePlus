/** @format */

// src/pages/BusinessSettings.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../components/Modal";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getBusinessSettings,
  updateBusinessSettings,
} from "../services/businessServices";
import { toast } from "react-toastify";
import InvoicePDFPreview from "../components/InvoicePDFPreview";
import { generateDummyData } from "../services/dummyDataServices";
import { useSecurity } from "../contexts/SecurityContext";
import { useUserContext } from "../contexts/UserContext";

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
  const { checkAll } = useSecurity();
  const { refetchUserData } = useUserContext();
  const { getAccessTokenSilently } = useAuth0();
  const { register, handleSubmit, watch, formState, reset } =
    useForm<BusinessForm>({
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
  const [showDummyModal, setShowDummyModal] = React.useState(false);
  const [dummyParams, setDummyParams] = React.useState({
    products: 0,
    sales: 0,
    finances: 0,
    budgets: 0,
  });
  const [isGenerating, setIsGenerating] = React.useState(false);

  const onSubmit = async (data: BusinessForm) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email offline_access",
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
      await refetchUserData();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al guardar los cambios");
    }
  };

  const logoFiles = watch("logo");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email offline_access",
          },
        });

        const data = await getBusinessSettings(token);

        reset({
          name: data.name || "",
          tagline: data.tagline || "",
          legalName: data.legal_name || "",
          taxId: data.tax_id || "",
          fiscalAddress: data.fiscal_address || "",
          phone: data.phone || "",
          email: data.email || "",
          currency: data.currency || "USD",
          invoicePrefix: data.invoice_prefix || "",
          invoiceCounter: data.invoice_counter || 1,
          paymentTermsAmount: data.payment_terms_amount || 30,
          paymentTermsUnit: data.payment_terms_unit || "días",
          bankDetails: data.bank_details || "",
          taxRates: data.tax_rates || "",
          timezone:
            data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: data.language || "es",
          dateFormat: data.date_format || "dd/mm/aaaa",
          numberFormat: data.number_format || "1.234,56",
          logo: undefined,
        });
      } catch (err) {
        console.error("Error al cargar configuración del negocio:", err);
        toast.error("No se pudo cargar la configuración del negocio.");
      }
    };

    fetchSettings();
  }, [getAccessTokenSilently, reset]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-neutral-800 rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Configuración de Mi Emprendimiento
      </h1>

      <button
        onClick={() => setShowDummyModal(true)}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
      >
        Generar datos de prueba
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 1. Identidad Básica */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              {...register("name", { required: true })}
              onChange={(e) => {
                checkAll(e.target.value);
              }}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tagline
            </label>
            <input
              {...register("tagline")}
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              NIF / CIF / RUC
            </label>
            <input
              {...register("taxId")}
              onChange={(e) => {
                checkAll(e.target.value);
              }}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dirección Fiscal
            </label>
            <input
              {...register("fiscalAddress")}
              onChange={(e) => {
                checkAll(e.target.value);
              }}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Teléfono
            </label>
            <input
              {...register("phone")}
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
                  onChange={(e) => {
                    checkAll(e.target.value);
                  }}
                  className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              <div>
                <select
                  {...register("paymentTermsUnit")}
                  onChange={(e) => {
                    checkAll(e.target.value);
                  }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Idioma
            </label>
            <select
              {...register("language")}
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
              onChange={(e) => {
                checkAll(e.target.value);
              }}
              className="mt-1 block w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formato de número
            </label>
            <input
              {...register("numberFormat")}
              onChange={(e) => {
                checkAll(e.target.value);
              }}
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
      {showDummyModal && (
        <Modal onClose={() => setShowDummyModal(false)}>
          <h2 className="text-xl font-bold mb-4">Generar datos de prueba</h2>
          {isGenerating && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsGenerating(true);
              try {
                const token = await getAccessTokenSilently();
                await generateDummyData(token, dummyParams);
                toast.success("Datos dummy generados correctamente");
                setShowDummyModal(false);
              } catch (err) {
                console.error(err);
                toast.error("Error generando los datos dummy");
              } finally {
                setIsGenerating(false);
              }
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {["products", "sales", "finances", "budgets"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {field}
                  </label>
                  <input
                    type="number"
                    disabled={isGenerating}
                    min={0}
                    value={dummyParams[field as keyof typeof dummyParams]}
                    onChange={(e) => {
                      checkAll(e.target.value);
                      setDummyParams((prev) => ({
                        ...prev,
                        [field]: parseInt(e.target.value),
                      }));
                    }}
                    className="mt-1 w-full border-gray-300 rounded p-2 bg-white dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t dark:border-neutral-600">
              <button
                type="button"
                onClick={() => setShowDummyModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Generar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
