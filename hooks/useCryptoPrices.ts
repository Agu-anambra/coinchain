"use client";
import { useEffect, useState } from "react";

type PriceData = {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
};

export default function useCryptoPrices() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crypto-price")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch prices", err);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
