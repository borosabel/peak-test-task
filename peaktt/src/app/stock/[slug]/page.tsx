import React from "react";
import StockDetails from "@/components/StockDetails";
import StockChart from "@/components/StockChart";
import {
  fetchStockDetails,
  fetchStockHistory,
} from "@/service/alphaVantageApi";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ timeframe?: string }>;
}

const StocksPage = async ({ params, searchParams }: PageProps) => {
  const symbol = (await params).slug;
  const timeFrame = (await searchParams)?.timeframe;

  const timeframe: "daily" | "weekly" | "monthly" =
    timeFrame === "weekly" || timeFrame === "monthly" ? timeFrame : "daily";

  if (!symbol) {
    return <div className="text-center mt-5">No stock selected.</div>;
  }

  let stock, history;

  try {
    stock = await fetchStockDetails(symbol);
    history = {
      daily: await fetchStockHistory(symbol, "daily"),
      weekly: await fetchStockHistory(symbol, "weekly"),
      monthly: await fetchStockHistory(symbol, "monthly"),
    };
  } catch (error) {
    console.error("Failed to fetch stock details:", error);
    return (
      <div className="text-center mt-5">
        Failed to load stock details for {symbol}. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f2ec] p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex justify-center items-center">
          <StockChart symbol={symbol} history={history} timeframe={timeframe} />
        </div>
        <div className="flex flex-col">
          <StockDetails stock={stock} />
        </div>
      </div>
    </div>
  );
};

export default StocksPage;
