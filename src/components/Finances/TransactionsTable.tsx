// src/components/finances/TransactionsTable.tsx

import { Transaction } from "./AddTransactionForm";

type Props = {
  data: Transaction[];
  onDelete: (id: string) => void;
};

export const TransactionsTable = ({ data, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-md border border-gray-200 dark:border-neutral-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
        <thead className="bg-gray-50 dark:bg-neutral-700">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
              Fecha
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
              Tipo
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
              Categoría
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
              Monto
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
          {data.map((tx) => (
            <tr key={tx.id}>
              <td className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-200">
                {tx.date}
              </td>
              <td className="px-4 py-2 text-sm">
                <span
                  className={`
                    px-2 py-1 rounded-full text-xs font-medium 
                    ${tx.type === "income"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }
                  `}
                >
                  {tx.type === "income" ? "Ingreso" : "Gasto"}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-200">
                {tx.category}
              </td>
              <td
                className={`
                  px-4 py-2 text-sm font-semibold text-right
                  ${tx.type === "income"
                    ? "text-green-600 dark:text-green-300"
                    : "text-red-600 dark:text-red-300"
                  }
                `}
              >
                ${tx.amount.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onDelete(tx.id)}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400"
              >
                No hay transacciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
