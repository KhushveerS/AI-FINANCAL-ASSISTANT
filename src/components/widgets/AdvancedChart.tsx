import React, { useEffect, useRef, memo } from 'react';

interface AdvancedChartProps {
  symbol?: string;
  interval?: string;
}

function AdvancedChart({ symbol = "NASDAQ:AAPL", interval = "D" }: AdvancedChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      // Clear previous widget
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": interval,
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": symbol,
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "autosize": true
      });
      container.current.appendChild(script);
    }
  }, [symbol, interval]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden bg-card">
      <div className="tradingview-widget-container h-full" ref={container} style={{ height: "100%", width: "100%" }}>
        <div className="tradingview-widget-container__widget h-full" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      </div>
    </div>
  );
}

export default memo(AdvancedChart);