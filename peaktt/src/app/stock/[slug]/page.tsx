import React from "react";
import StockDetails from "@/components/StockDetails";
import { fetchStockDetails } from "@/service/alphaVantageApi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const StocksPage = async ({ params }: PageProps) => {
  const symbol = (await params).slug;

  if (!symbol) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No stock selected.
      </div>
    );
  }

  let stock;

  try {
    stock = await fetchStockDetails(symbol);
  } catch (error) {
    console.error("Failed to fetch stock details:", error);
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Failed to load stock details for {symbol}. Please try again later.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3, padding: "20px" }}>
        <StockDetails stock={stock} />
      </div>
    </div>
  );
};

export default StocksPage;
