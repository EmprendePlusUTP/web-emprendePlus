// src/components/ChartToolButtons.tsx
import React from 'react';

export interface ChartToolButton {
  /** Icono o ReactNode que se renderizará dentro del botón */
  icon: React.ReactNode;
  /** Función a ejecutar cuando se haga click */
  onClick: () => void;
  /** Clases adicionales para el botón */
  className?: string;
  /** Texto para mostrar en tooltip (title) */
  tooltip?: string;
}

export interface ChartToolButtonsProps {
  /** Lista de botones a renderizar */
  buttons: ChartToolButton[];
  /** Clases extra para el contenedor */
  className?: string;
}

const ChartToolButtons: React.FC<ChartToolButtonsProps> = ({
  buttons,
  className = '',
}) => (
  <div className={`flex flex-row gap-5 pb-2 ${className}`}>  
    {buttons.map((btn, idx) => (
      <button
        key={idx}
        onClick={btn.onClick}
        className={`w-fit p-2 dark:bg-gray-500 rounded-md dark:text-gray-200 cursor-pointer ${btn.className ?? ''}`}
        title={btn.tooltip}
      >
        {btn.icon}
      </button>
    ))}
  </div>
);

export default ChartToolButtons;
