import React from "react";

interface TimeframeButtonsProps {
  symbol: string;
  current: "daily" | "weekly" | "monthly";
}

const TimeframeButtons: React.FC<TimeframeButtonsProps> = ({
  symbol,
  current,
}) => {
  return (
    <div className="flex gap-4">
      {["daily", "weekly", "monthly"].map((timeframe) => (
        <form key={timeframe} method="get" action={`/stock/${symbol}`}>
          <input type="hidden" name="timeframe" value={timeframe} />
          <button
            type="submit"
            className={`px-4 py-2 ${
              current === timeframe ? "bg-blue-600 text-white" : "bg-gray-300"
            } rounded-md`}
          >
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </button>
        </form>
      ))}
    </div>
  );
};

export default TimeframeButtons;
