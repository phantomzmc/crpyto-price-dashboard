"use client";

import React, { useEffect, useState } from "react";

enum COIN_FROM_TRADE {
  ETH = "ethusdt",
  BTC = "btcusdt",
  BNB = "bnbusdt",
}

export default function Dashboard() {
  const [prices, setPrices] = useState<any>({});

  const pairs = [COIN_FROM_TRADE.ETH, COIN_FROM_TRADE.BTC, COIN_FROM_TRADE.BNB];

  useEffect(() => {
    // สร้าง WebSocket connection ไปยัง Binance API
    const fetchDataSocket = pairs.map((pair) => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${pair}@trade`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p).toFixed(2);

        // อัปเดตราคาล่าสุดใน state
        setPrices((prevPrices: any) => ({
          ...prevPrices,
          [pair.toUpperCase()]: price,
        }));
      };
      return ws;
    });
    return () => fetchDataSocket.forEach((ws) => ws.close()); // ปิด WebSocket connection เมื่อ component ถูก unmount
  }, []);

  return (
    <div className="p-5">
      <h1>Crypto Price Dashboard</h1>
      <div>
        {pairs.map((pair) => (
          <h2 key={pair}>
            {pair.toUpperCase()}:{" "}
            {prices[pair.toUpperCase()]
              ? `$${prices[pair.toUpperCase()]}`
              : "Loading..."}
          </h2>
        ))}
      </div>
    </div>
  );
}
