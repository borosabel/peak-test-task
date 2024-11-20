import React from "react";
import TimeframeButtons from "@/components/TimeframeButtons";
import { StockChartProps } from "@/types/alphaVantageTypes";

const StockChart: React.FC<StockChartProps> = ({
  symbol,
  history,
  timeframe,
}) => {
  const QUICKCHART_URL = process.env.NEXT_PUBLIC_QUICKCHART_URL;

  const isPriceRising =
    history[timeframe][0]?.close <
    history[timeframe][history[timeframe].length - 1]?.close;

  const chartUrl = `${QUICKCHART_URL}?c=${encodeURIComponent(
    JSON.stringify({
      type: "line",
      data: {
        labels: history[timeframe].map((data) => data.date).reverse(),
        datasets: [
          {
            label: `${symbol} Closing Price (${timeframe})`,
            data: history[timeframe].map((data) => data.close).reverse(),
            borderColor: isPriceRising
              ? "rgba(75, 192, 75, 1)"
              : "rgba(192, 75, 75, 1)",
            fill: true,
          },
        ],
      },
    }),
  )}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-md">
        <img
          src={chartUrl}
          alt={`${symbol} Price History (${timeframe})`}
          className="w-full h-auto"
        />
      </div>
      <TimeframeButtons symbol={symbol} current={timeframe} />
    </div>
  );
};

export default StockChart;
