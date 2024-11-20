import React from "react";
import TimeframeButtons from "@/components/TimeframeButtons";
import { StockChartProps } from "@/types/alphaVantageTypes";

const StockChart: React.FC<StockChartProps> = ({
  symbol,
  history,
  timeframe,
}) => {
  const QUICKCHART_URL = process.env.NEXT_PUBLIC_QUICKCHART_URL;

  const currentHistory = history[timeframe];

  if (
    !currentHistory.success ||
    !currentHistory.data ||
    currentHistory.data.length === 0
  ) {
    return (
      <div className="text-center mt-5">
        No historical data available for {timeframe} timeframe.
      </div>
    );
  }

  const isPriceRising =
    currentHistory.data[0]?.close <
    currentHistory.data[currentHistory.data.length - 1]?.close;

  const chartConfig = {
    type: "line",
    data: {
      labels: currentHistory.data.map((data) => data.date).reverse(),
      datasets: [
        {
          label: `${symbol} Closing Price (${timeframe})`,
          data: currentHistory.data.map((data) => data.close).reverse(),
          borderColor: isPriceRising
            ? "rgba(75, 192, 75, 1)"
            : "rgba(192, 75, 75, 1)",
          fill: true,
        },
      ],
    },
  };

  const chartUrl = `${QUICKCHART_URL}?c=${encodeURIComponent(
    JSON.stringify(chartConfig),
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
