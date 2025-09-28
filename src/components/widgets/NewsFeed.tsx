import React, { useEffect, useRef, memo } from 'react';

function NewsFeed() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "displayMode": "regular",
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": false,
        "locale": "en",
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

export default memo(NewsFeed);