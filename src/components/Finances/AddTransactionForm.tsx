// src/components/finances/AddTransactionForm.tsx
import React, { useState } from "react";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string; // formato YYYY-MM-DD
};

type Props = {
  onAdd: (tx: Transaction) => void;
};

export const AddTransactionForm = ({ onAdd }: Props) => {
  const [type, setType] = useState<TransactionType>("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || amount <= 0 || !date) return;

    onAdd({
      id: crypto.randomUUID(),
      type,
      category,
      amount,
      date,
    });

    // Limpiar campos
    setCategory("");
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md mb-6 border border-gray-200 dark:border-neutral-700"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-100 mb-4">
        Agregar Transacción
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">
            Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="w-full border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-800 dark:text-white focus:ring-blue-200 focus:border-blue-200"
          >
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">
            Categoría
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej. Ventas, Renta, Sueldos..."
            className="w-full border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-800 dark:text-white focus:ring-blue-200 focus:border-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">
            Monto ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-800 dark:text-white focus:ring-blue-200 focus:border-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-800 dark:text-white focus:ring-blue-200 focus:border-blue-200"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        Agregar
      </button>
    </form>
  );
};
