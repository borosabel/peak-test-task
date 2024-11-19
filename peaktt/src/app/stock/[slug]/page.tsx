import React from "react";
import StockDetails from "@/components/StockDetails";
import {
  fetchStockDetails,
  fetchStockHistory,
} from "@/service/alphaVantageApi";

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

  let stock, history;

  try {
    stock = await fetchStockDetails(symbol);
    history = await fetchStockHistory(symbol);
  } catch (error) {
    console.error("Failed to fetch stock details:", error);
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Failed to load stock details for {symbol}. Please try again later.
      </div>
    );
  }

  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
    JSON.stringify({
      type: "line",
      data: {
        labels: history.map((data) => data.date).reverse(),
        datasets: [
          {
            label: `${symbol} Closing Price`,
            data: history.map((data) => data.close).reverse(),
            borderColor: "rgba(75, 192, 192, 1)",
            fill: true,
          },
        ],
      },
    }),
  )}`;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div style={{ flex: 1 }}>
        <StockDetails stock={stock} />
      </div>
      <div style={{ flex: 2 }}>
        <img
          src={chartUrl}
          alt={`${symbol} Price History`}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default StocksPage;
