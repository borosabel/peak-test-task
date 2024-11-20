import React from "react";
import classNames from "classnames";
import { StockDetailsCardProps } from "@/types/alphaVantageTypes";

const StockDetailsCard: React.FC<StockDetailsCardProps> = ({
  label,
  value,
  className,
}) => {
  return (
    <div
      className={classNames("p-4 bg-white shadow-md text-center", className)}
    >
      <p className="font-semibold text-gray-600">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default StockDetailsCard;
