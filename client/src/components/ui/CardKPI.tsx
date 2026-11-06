import React from "react";
import { CardKPIProps } from "@/interfaces/KPI";

// As cores chegam como classes Tailwind completas (ex.: "bg-zinc-900"),
// pois o Tailwind não gera classes montadas dinamicamente como `bg-${cor}`.
export const CardKPI: React.FC<CardKPIProps> = ({ title, value, bgcolor, bordercolor, textcolor }) => {
  return (
    <div className={`p-4 rounded-xl border shadow-xs ${bgcolor} ${bordercolor ?? ""}`}>
      <span className={`text-xs font-medium uppercase tracking-wider ${textcolor}`}>{title}</span>
      <p className={`mt-1 text-2xl font-bold ${textcolor}`}>{value}</p>
    </div>
  );
};
