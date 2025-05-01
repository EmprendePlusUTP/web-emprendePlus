// src/components/ChartCard.tsx
import React, { ReactNode } from "react";

export interface ChartCardProps {
  title?: string;
  value?: string;
  changeBadge?: ReactNode;
  /** Donde irá tu gráfico o contenido */
  children: ReactNode;
  /** Para añadir clases Tailwind extras */
  className?: string;
  /** Define el ancho: auto (por defecto), full (100%) o fit (ajustado al contenido) */
  widthMode?: "auto" | "full" | "fit";
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  changeBadge,
  children,
  className = "",
  widthMode = "auto",
}) => {
  // Mapeamos widthMode a clases de Tailwind
  const widthClasses = {
    auto: "",
    full: "w-full",
    fit: "w-fit",
  } as const;

  return (
    <div
      className={[
        // Padding y layout
        "p-4 md:p-5 flex flex-col",
        // Fondo, borde y sombras
        "bg-white border border-gray-200 shadow-2xs rounded-xl",
        "dark:bg-neutral-800 dark:border-neutral-700",
        "min-w-0",
        // Ancho según prop
        widthClasses[widthMode],
        // Cualquier clase extra
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Header: título, valor y badge */}
      {(title || value || changeBadge) && (
        <div className="flex justify-between items-center mb-4">
          <div>
            {title && (
              <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                {title}
              </h2>
            )}
            {value && (
              <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {value}
              </p>
            )}
          </div>
          {changeBadge && <div>{changeBadge}</div>}
        </div>
      )}

      {/* Contenido (chart, tabla, etc.) */}
      <div className="flex-1 min-w-0 overflow-hidden">{children}</div>
    </div>
  );
};

export default ChartCard;
