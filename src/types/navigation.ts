// src/types/navigation.ts
import { ReactNode } from "react";

export interface NavItem {
  /** Texto que se muestra */
  label: string;
  /** Ruta a la que navega */
  to: string;
  /** Icono, puede ser cualquier ReactNode */
  icon: ReactNode;
  /** Si tiene children, se interpretará como dropdown */
  children?: NavItem[];
}
