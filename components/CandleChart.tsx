"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Select } from "@/components/ui/select"; // Optional: use your select, or Tailwind

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const timeOptions = [
  { label: "1D", value: "1" },
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
];

interface CandleChartProps {
  coinId: string;
  label: string;
}

export default function CandleChart({ coinId, label }: CandleChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [days, setDays] = useState("7");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
      );
      const data = await res.json();

      const formatted = data.map((d: number[]) => ({
        x: new Date(d[0]),
        y: [d[1], d[2], d[3], d[4]].map((v) => parseFloat(v.toFixed(2))),
      }));

      setChartData(formatted);
    }

    fetchData();
  }, [coinId, days]);

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{label} Market Chart</h2>
        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ApexChart
        type="candlestick"
        series={[{ data: chartData }]}
        height={350}
        options={{
          chart: {
            type: "candlestick",
            toolbar: { show: false },
          },
          xaxis: {
            type: "datetime",
          },
          yaxis: {
            tooltip: { enabled: true },
          },
          tooltip: {
            shared: true,
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
              const d = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
              return `
                <div class="p-2">
                  <b>${new Date(d.x).toLocaleString()}</b><br/>
                  Open: $${d.y[0]}<br/>
                  High: $${d.y[1]}<br/>
                  Low: $${d.y[2]}<br/>
                  Close: $${d.y[3]}
                </div>
              `;
            },
          },
        }}
      />
    </div>
  );
}
