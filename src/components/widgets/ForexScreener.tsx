import React, { useEffect, useRef, memo } from 'react';

function ForexScreener() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "market": "forex",
        "showToolbar": true,
        "defaultColumn": "overview",
        "defaultScreen": "general",
        "isTransparent": false,
        "locale": "en",
        "colorTheme": "dark",
        "width": "100%",
        "height": "100%"
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden bg-card">
      <div className="tradingview-widget-container h-full" ref={container}>
        <div className="tradingview-widget-container__widget h-full"></div>
      </div>
    </div>
  );
}

export default memo(ForexScreener);