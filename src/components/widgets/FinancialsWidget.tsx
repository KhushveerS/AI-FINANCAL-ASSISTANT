import React, { useEffect, useRef, memo } from 'react';

interface FinancialsWidgetProps {
  symbol?: string;
}

function FinancialsWidget({ symbol = "NASDAQ:AAPL" }: FinancialsWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      // Clear previous widget
      container.current.innerHTML = '';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "symbol": symbol,
        "colorTheme": "dark",
        "displayMode": "regular",
        "isTransparent": false,
        "locale": "en",
        "width": "100%",
        "height": "100%"
      });
      container.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden bg-card">
      <div className="tradingview-widget-container h-full" ref={container}>
        <div className="tradingview-widget-container__widget h-full"></div>
      </div>
    </div>
  );
}

export default memo(FinancialsWidget);