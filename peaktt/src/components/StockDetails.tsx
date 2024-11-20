import React from "react";
import StockDetailsCard from "@/components/StockDetailsCard";
import { StockDetailsProps } from "@/types/alphaVantageTypes";

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center mb-4">
        <img
          src={`https://logo.clearbit.com/${stock.symbol.toLowerCase()}.com`}
          alt={`${stock.symbol} Logo`}
          className="w-20 h-20 mx-auto mb-4"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <StockDetailsCard label="Price" value={`$${stock.price}`} />
        <StockDetailsCard label="Open" value={`$${stock.open}`} />
        <StockDetailsCard label="High" value={`$${stock.high}`} />
        <StockDetailsCard label="Low" value={`$${stock.low}`} />
        <StockDetailsCard label="Volume" value={stock.volume} />
        <StockDetailsCard
          label="Previous Close"
          value={`$${stock.previousClose}`}
        />
        <StockDetailsCard
          label="Change"
          value={`$${stock.change} (${stock.changePercent})`}
          className="col-span-1 sm:col-span-2"
        />
      </div>
    </div>
  );
};

export default StockDetails;
