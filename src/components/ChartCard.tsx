// src/components/ChartCard.tsx
import React, { ReactNode } from "react";

export interface ChartCardProps {
  title: string;
  value: string;
  changeBadge?: ReactNode;
  children: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  changeBadge,
  children,
}) => (
  <div className="p-4 md:p-5 flex w-auto flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-sm text-gray-500 dark:text-neutral-500">
          {title}
        </h2>
        <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
          {value}
        </p>
      </div>
      {changeBadge}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

export default ChartCard;
