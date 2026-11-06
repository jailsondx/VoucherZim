import React from "react";
import { BadgeProps } from "@/interfaces/Badge";

export const Badge: React.FC<BadgeProps> = ({
  value,
  bgcolor,
  bordercolor,
  textcolor,
  dotColor,
  animate,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bgcolor} ${textcolor} border ${bordercolor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${animate}`}></span>
      {value}
    </div>
  );
};