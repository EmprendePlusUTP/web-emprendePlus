// src/components/ResponsiveChartWrapper.tsx
import React, { useRef } from "react";
import { useContainerWidth } from "../hooks/useContainerWidth";

type ResponsiveChartWrapperProps = {
  /** Un render-prop que recibe el ancho disponible */
  children: (width: number) => React.ReactNode;
  /** Para estilos extra, p.ej. controlar la altura */
  className?: string;
};

const ResponsiveChartWrapper: React.FC<ResponsiveChartWrapperProps> = ({
  children,
  className = "",
}) => {
  // ref interno para medir
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* Sólo renderizamos cuando ya tengamos width válido */}
      {width > 0 ? children(width) : null}
    </div>
  );
};

export default ResponsiveChartWrapper;
