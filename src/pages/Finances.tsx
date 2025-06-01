// src/components/finances/FinancesPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowUpCircle, ArrowDownCircle, BarChart2 } from "lucide-react";
import {
  AddTransactionForm,
  Transaction,
} from "../components/Finances/AddTransactionForm";
import {
  MonthlyData,
  MonthlyTrendsChart,
} from "../components/Finances/MonthlyTrendsChart";
import { FinanceSummaryCard } from "../components/Finances/FinanceSummaryCard";
import { TransactionsTable } from "../components/Finances/TransactionsTable";
import Modal from "../components/Modal";
import RacingBarChartWithControls from "../components/RacingBarChartWithControls";
import { useKeyframes, type Keyframe } from "../hooks/useKeyframes";
import { dummyData } from "../components/DummyBarRaceData";
import ChartCard from "../components/ChartCard";

export const Finances = () => {
  const keyframes: Keyframe[] = useKeyframes(dummyData, 8);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Estado para el modal y simulación seleccionada
  const [showModal, setShowModal] = useState(false);
  const [selectedSim, setSelectedSim] = useState<"bar" | null>(null);
  const navigate = useNavigate();

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") income += tx.amount;
      else expense += tx.amount;
    });

    const net = parseFloat((income - expense).toFixed(2));
    return {
      income: parseFloat(income.toFixed(2)),
      expense: parseFloat(expense.toFixed(2)),
      net,
    };
  }, [transactions]);

  const monthlyData: MonthlyData[] = useMemo(() => {
    const agrupado: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((tx) => {
      const monthKey = tx.date.slice(0, 7);
      if (!agrupado[monthKey]) agrupado[monthKey] = { income: 0, expense: 0 };
      if (tx.type === "income") agrupado[monthKey].income += tx.amount;
      else agrupado[monthKey].expense += tx.amount;
    });

    return Object.entries(agrupado)
      .map(([month, vals]) => ({
        month,
        income: parseFloat(vals.income.toFixed(2)),
        expense: parseFloat(vals.expense.toFixed(2)),
        net: parseFloat((vals.income - vals.expense).toFixed(2)),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  return (
    <div>
      {/* Botón Simulaciones */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          Simulaciones
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          onClick={() => navigate("/finances/details")}
        >
          Ver Detalles
        </button>
      </div>

      {/* Modal de Simulaciones */}
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setSelectedSim(null);
          }}
        >
          <div className="p-6 min-w-[320px] relative dark:text-neutral-100">
            <h2 className="text-lg font-semibold mb-4">Simulaciones</h2>
            <div className="flex flex-col gap-3">
              <button
                className="px-3 py-2 bg-blue-100 rounded hover:bg-blue-200 dark:text-gray-800"
                onClick={() => setSelectedSim("bar")}
              >
                Simulación Gráfico de Barras
              </button>
              {/* Puedes agregar más botones para otras simulaciones aquí */}
            </div>
            <div className="mt-6">
              {selectedSim === "bar" && (
                <ChartCard title="Productos Estrellas">
                  <RacingBarChartWithControls
                    keyframes={keyframes}
                    numOfBars={10}
                  />
                </ChartCard>
              )}
              {/* Renderiza otras simulaciones según selectedSim */}
            </div>
          </div>
        </Modal>
      )}

      {/* Título de la página */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-100">
          Finanzas del Emprendimiento
        </h1>
      </header>

      {/* 1. Resumen Ejecutivo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FinanceSummaryCard
          title="Ingresos Totales"
          value={totals.income}
          className="bg-green-50 dark:bg-green-900"
          icon={
            <ArrowUpCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
          }
        />
        <FinanceSummaryCard
          title="Gastos Totales"
          value={totals.expense}
          className="bg-red-50 dark:bg-red-900"
          icon={
            <ArrowDownCircle className="h-8 w-8 text-red-600 dark:text-red-300" />
          }
        />
        <FinanceSummaryCard
          title="Ganancia Neta"
          value={totals.net}
          className="bg-blue-50 dark:bg-blue-900"
          icon={
            <BarChart2 className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          }
        />
      </section>

      {/* 2. Formulario para agregar transacciones */}
      <section className="mb-8">
        <AddTransactionForm onAdd={handleAddTransaction} />
      </section>

      {/* 3. Tabla de transacciones */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-100 mb-4">
          Historial de Transacciones
        </h2>
        <TransactionsTable
          data={transactions}
          onDelete={handleDeleteTransaction}
        />
      </section>

      {/* 4. Gráfico de tendencias mensuales */}
      <section>
        <MonthlyTrendsChart data={monthlyData} />
      </section>
    </div>
  );
};

export default Finances;
