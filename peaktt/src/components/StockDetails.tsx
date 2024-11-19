import React from "react";
import { StockQuote } from "@/types/alphaVantageTypes";

interface StockDetailsProps {
  stock: StockQuote;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock }) => {
  return (
    <div>
      <h1>{stock.symbol}</h1>
      <p>
        <strong>Price:</strong> ${stock.price}
      </p>
      <p>
        <strong>Open:</strong> ${stock.open}
      </p>
      <p>
        <strong>High:</strong> ${stock.high}
      </p>
      <p>
        <strong>Low:</strong> ${stock.low}
      </p>
      <p>
        <strong>Volume:</strong> {stock.volume}
      </p>
      <p>
        <strong>Previous Close:</strong> ${stock.previousClose}
      </p>
      <p>
        <strong>Change:</strong> ${stock.change} ({stock.changePercent})
      </p>
    </div>
  );
};

export default StockDetails;
