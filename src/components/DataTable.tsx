// src/components/DataTable.tsx
import React from "react";
import BaseTable, { Column } from "./BaseTable";

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Opción para colocar un toolbar encima (botones, filtros…) */
  toolbar?: React.ReactNode;
  /** Título opcional para mostrar en el DataTable */
  title: string;
}

function DataTable<T>({ columns, data, toolbar, title }: DataTableProps<T>) {
  return (
    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow space-y-4">
      <div className="flex justify-between items-center">
      {title && (
        <h2 className="lg:text-lg xl:text-xl font-semibold text-gray-800 dark:text-neutral-200">
        {title}
        </h2>
      )}
      {toolbar && <div>{toolbar}</div>}
      </div>
      <BaseTable columns={columns} data={data} />
    </div>
  );
}

export default DataTable;
