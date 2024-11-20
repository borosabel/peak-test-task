import React from "react";
import StockDetails from "@/components/StockDetails";
import StockChart from "@/components/StockChart";
import {
  fetchStockDetails,
  fetchStockHistory,
} from "@/service/alphaVantageApi";
import HomeButton from "@/components/HomeButton";

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
    return (
      <div className="min-h-screen bg-[#f6f2ec] p-8 flex flex-col items-center justify-center">
        <p className="text-center text-xl text-[#f37a59]">No stock selected.</p>
        <a
          href="/stocks"
          className="mt-4 bg-[#f37a59] text-white px-4 py-2 rounded-md hover:bg-[#e06650] inline-flex items-center gap-2"
        >
          <span>&larr;</span> Back to Stock Search
        </a>
      </div>
    );
  }

  const stockResponse = await fetchStockDetails(symbol);

  if (!stockResponse.success) {
    return (
      <div className="min-h-screen bg-[#f6f2ec] p-8 flex flex-col items-center justify-center">
        <p className="text-center text-xl text-[#f37a59]">
          Stock data for &#34;{symbol}&#34; is not available.
        </p>
        <a
          href="/stocks"
          className="mt-4 bg-[#f37a59] text-white px-4 py-2 rounded-md hover:bg-[#e06650] inline-flex items-center gap-2"
        >
          <span>&larr;</span> Back to Stock Search
        </a>
      </div>
    );
  }

  const history = {
    daily: await fetchStockHistory(symbol, "daily"),
    weekly: await fetchStockHistory(symbol, "weekly"),
    monthly: await fetchStockHistory(symbol, "monthly"),
  };

  return (
    <div className="min-h-screen bg-[#f6f2ec] p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex justify-center items-center">
          <StockChart symbol={symbol} history={history} timeframe={timeframe} />
        </div>
        <div className="flex flex-col">
          <StockDetails stock={stockResponse.data!} />
        </div>
      </div>
      <div className="mt-8 text-center">
        <HomeButton />
      </div>
    </div>
  );
};

export default StocksPage;
