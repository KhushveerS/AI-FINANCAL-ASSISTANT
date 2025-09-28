import React, { useEffect, useRef, memo } from 'react';

function ETFHeatmap() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-etf-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "dataSource": "AllUSEtf",
        "blockSize": "volume",
        "blockColor": "change",
        "grouping": "asset_class",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
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

export default memo(ETFHeatmap);