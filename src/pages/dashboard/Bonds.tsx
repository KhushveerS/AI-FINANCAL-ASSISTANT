import React, { useState, useEffect } from 'react';

// Types for our bond data
interface TreasuryYield {
  maturity: string;
  yield: number;
  change: number;
  lastUpdated: string;
}

interface TreasuryBill {
  maturity: string;
  discountRate: number;
  investmentRate: number;
  lastAuctionDate: string;
}

interface YieldCurvePoint {
  maturity: string;
  yield: number;
  months: number;
  symbol?: string;
  sourceUrl: string;
  description: string;
}

const BondMarketDashboard: React.FC = () => {
  const [treasuryYields, setTreasuryYields] = useState<TreasuryYield[]>([]);
  const [tBills, setTBills] = useState<TreasuryBill[]>([]);
  const [yieldCurve, setYieldCurve] = useState<YieldCurvePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedPoint, setSelectedPoint] = useState<YieldCurvePoint | null>(null);

  // Mock data - in real app, you'd fetch from APIs mentioned
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock Treasury Yields
      setTreasuryYields([
        { maturity: '1 Month', yield: 5.32, change: -0.02, lastUpdated: '2024-01-20' },
        { maturity: '3 Month', yield: 5.35, change: -0.01, lastUpdated: '2024-01-20' },
        { maturity: '6 Month', yield: 5.28, change: 0.03, lastUpdated: '2024-01-20' },
        { maturity: '1 Year', yield: 4.89, change: -0.05, lastUpdated: '2024-01-20' },
        { maturity: '2 Year', yield: 4.36, change: -0.08, lastUpdated: '2024-01-20' },
        { maturity: '5 Year', yield: 4.08, change: -0.06, lastUpdated: '2024-01-20' },
        { maturity: '10 Year', yield: 4.12, change: -0.04, lastUpdated: '2024-01-20' },
        { maturity: '30 Year', yield: 4.34, change: -0.03, lastUpdated: '2024-01-20' }
      ]);

      // Mock T-Bills
      setTBills([
        { maturity: '4-Week', discountRate: 5.31, investmentRate: 5.42, lastAuctionDate: '2024-01-18' },
        { maturity: '8-Week', discountRate: 5.29, investmentRate: 5.41, lastAuctionDate: '2024-01-16' },
        { maturity: '13-Week', discountRate: 5.33, investmentRate: 5.47, lastAuctionDate: '2024-01-15' },
        { maturity: '26-Week', discountRate: 5.26, investmentRate: 5.45, lastAuctionDate: '2024-01-15' }
      ]);

      // Enhanced Yield Curve Data with source URLs
      setYieldCurve([
        { 
          maturity: '1M', 
          yield: 5.32, 
          months: 1, 
          symbol: 'DGS1MO',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS1MO',
          description: '1-Month Treasury Constant Maturity Rate'
        },
        { 
          maturity: '3M', 
          yield: 5.35, 
          months: 3, 
          symbol: 'DGS3MO',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS3MO',
          description: '3-Month Treasury Bill Secondary Market Rate'
        },
        { 
          maturity: '6M', 
          yield: 5.28, 
          months: 6, 
          symbol: 'DGS6MO',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS6MO',
          description: '6-Month Treasury Bill Secondary Market Rate'
        },
        { 
          maturity: '1Y', 
          yield: 4.89, 
          months: 12, 
          symbol: 'DGS1',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS1',
          description: '1-Year Treasury Constant Maturity Rate'
        },
        { 
          maturity: '2Y', 
          yield: 4.36, 
          months: 24, 
          symbol: 'DGS2',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS2',
          description: '2-Year Treasury Constant Maturity Rate'
        },
        { 
          maturity: '5Y', 
          yield: 4.08, 
          months: 60, 
          symbol: 'DGS5',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS5',
          description: '5-Year Treasury Constant Maturity Rate'
        },
        { 
          maturity: '10Y', 
          yield: 4.12, 
          months: 120, 
          symbol: 'DGS10',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS10',
          description: '10-Year Treasury Constant Maturity Rate'
        },
        { 
          maturity: '30Y', 
          yield: 4.34, 
          months: 360, 
          symbol: 'DGS30',
          sourceUrl: 'https://fred.stlouisfed.org/series/DGS30',
          description: '30-Year Treasury Constant Maturity Rate'
        }
      ]);

      setLastUpdated(new Date().toLocaleString());
      setLoading(false);
    };

    loadData();
  }, []);

  const handlePointClick = (point: YieldCurvePoint) => {
    setSelectedPoint(point);
    // Open the source URL in a new tab
    window.open(point.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Enhanced yield curve chart component with clickable points
  const YieldCurveChart: React.FC<{ data: YieldCurvePoint[] }> = ({ data }) => {
    const maxYield = Math.max(...data.map(d => d.yield));
    const minYield = Math.min(...data.map(d => d.yield));
    const range = maxYield - minYield;
    
    return (
      <div className="yield-curve-chart">
        <div className="chart-title text-lg font-semibold text-white mb-4">
          Treasury Yield Curve
          <div className="text-sm text-blue-300 font-normal mt-1">
            Click any point to view detailed data source
          </div>
        </div>
        <div className="chart-container relative h-64 bg-gradient-to-b from-blue-50/10 to-gray-100/10 rounded-lg border border-gray-700 p-4">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 gap-0">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="border-r border-gray-600/30"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-5 gap-0">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-b border-gray-600/30"></div>
            ))}
          </div>
          
          {/* Yield points and line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={`M ${data.map((point, index) => 
                `${(index / (data.length - 1)) * 100}%,${100 - ((point.yield - minYield) / range) * 100}%`
              ).join(' L ')}`}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {data.map((point, index) => (
              <g key={point.maturity}>
                <circle
                  cx={`${(index / (data.length - 1)) * 100}%`}
                  cy={`${100 - ((point.yield - minYield) / range) * 100}%`}
                  r="6"
                  fill={selectedPoint?.maturity === point.maturity ? "#f59e0b" : "#1e40af"}
                  stroke={selectedPoint?.maturity === point.maturity ? "#f59e0b" : "#60a5fa"}
                  strokeWidth="2"
                  className="cursor-pointer hover:r-8 transition-all"
                  onClick={() => handlePointClick(point)}
                />
                <title>{point.description}: {point.yield}% - Click for details</title>
              </g>
            ))}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-blue-300">
            {[maxYield, (maxYield + minYield) / 2, minYield].map((value, index) => (
              <div key={index} className="px-2 bg-gray-800/80 rounded">
                {value.toFixed(2)}%
              </div>
            ))}
          </div>
        </div>

        {/* Selected Point Info */}
        {selectedPoint && (
          <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white text-lg">{selectedPoint.maturity} Treasury</h4>
                <p className="text-blue-200 text-sm">{selectedPoint.description}</p>
                <p className="text-white font-mono text-xl mt-2">{selectedPoint.yield}%</p>
                <p className="text-blue-300 text-xs mt-1">FRED Symbol: {selectedPoint.symbol}</p>
              </div>
              <button
                onClick={() => handleSourceClick(selectedPoint.sourceUrl)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Data Source
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to handle row clicks in tables
  const getRowSourceUrl = (maturity: string): string => {
    const maturityMap: { [key: string]: string } = {
      '1 Month': 'https://fred.stlouisfed.org/series/DGS1MO',
      '3 Month': 'https://fred.stlouisfed.org/series/DGS3MO',
      '6 Month': 'https://fred.stlouisfed.org/series/DGS6MO',
      '1 Year': 'https://fred.stlouisfed.org/series/DGS1',
      '2 Year': 'https://fred.stlouisfed.org/series/DGS2',
      '5 Year': 'https://fred.stlouisfed.org/series/DGS5',
      '10 Year': 'https://fred.stlouisfed.org/series/DGS10',
      '30 Year': 'https://fred.stlouisfed.org/series/DGS30',
      '4-Week': 'https://www.treasurydirect.gov/auctions/auction-query/',
      '8-Week': 'https://www.treasurydirect.gov/auctions/auction-query/',
      '13-Week': 'https://www.treasurydirect.gov/auctions/auction-query/',
      '26-Week': 'https://www.treasurydirect.gov/auctions/auction-query/'
    };
    return maturityMap[maturity] || 'https://www.treasury.gov/';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 bg-gray-900 rounded-lg">
        <div className="text-lg text-blue-400">Loading bond market data...</div>
      </div>
    );
  }

  return (
    <div className="bond-market-dashboard p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">U.S. Bond Market Data</h1>
        <p className="text-blue-200">Real-time Treasury yields and bill rates - Click any data point for detailed sources</p>
        <div className="last-updated text-sm text-blue-300 mt-2">
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* Quick Source Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => handleSourceClick('https://www.treasurydirect.gov/')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-medium transition-colors text-center"
        >
          TreasuryDirect.gov
        </button>
        <button
          onClick={() => handleSourceClick('https://fred.stlouisfed.org/categories/115')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-medium transition-colors text-center"
        >
          FRED Treasury Data
        </button>
        <button
          onClick={() => handleSourceClick('https://www.federalreserve.gov/releases/h15/')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-medium transition-colors text-center"
        >
          Fed H.15 Release
        </button>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div 
          className="metric-card bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => handleSourceClick('https://fred.stlouisfed.org/series/DGS10')}
        >
          <div className="metric-label text-sm text-blue-300">10-Year Yield</div>
          <div className="metric-value text-2xl font-bold text-white">4.12%</div>
          <div className="metric-change text-red-400">-0.04%</div>
          <div className="text-xs text-blue-400 mt-2">Click for FRED data</div>
        </div>
        <div 
          className="metric-card bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => handleSourceClick('https://fred.stlouisfed.org/series/DGS2')}
        >
          <div className="metric-label text-sm text-blue-300">2-Year Yield</div>
          <div className="metric-value text-2xl font-bold text-white">4.36%</div>
          <div className="metric-change text-red-400">-0.08%</div>
          <div className="text-xs text-blue-400 mt-2">Click for FRED data</div>
        </div>
        <div className="metric-card bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="metric-label text-sm text-blue-300">Yield Spread</div>
          <div className="metric-value text-2xl font-bold text-white">-0.24%</div>
          <div className="metric-change text-green-400">+0.04%</div>
        </div>
        <div 
          className="metric-card bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => handleSourceClick('https://fred.stlouisfed.org/series/DGS3MO')}
        >
          <div className="metric-label text-sm text-blue-300">3-Month T-Bill</div>
          <div className="metric-value text-2xl font-bold text-white">5.35%</div>
          <div className="metric-change text-red-400">-0.01%</div>
          <div className="text-xs text-blue-400 mt-2">Click for FRED data</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treasury Yields Widget */}
        <div className="widget bg-gray-800 rounded-lg border border-gray-700">
          <div className="widget-header p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Treasury Yields</h2>
            <p className="text-blue-300 text-sm mt-1">Click any row for detailed data source</p>
          </div>
          <div className="widget-content p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-blue-300 font-medium">Maturity</th>
                    <th className="text-right py-3 text-blue-300 font-medium">Yield</th>
                    <th className="text-right py-3 text-blue-300 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {treasuryYields.map((bond) => (
                    <tr 
                      key={bond.maturity} 
                      className="border-b border-gray-700/50 hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => handleSourceClick(getRowSourceUrl(bond.maturity))}
                    >
                      <td className="py-3 text-white">
                        <div className="font-medium">{bond.maturity}</div>
                        <div className="text-xs text-blue-400">Click for source</div>
                      </td>
                      <td className="text-right py-3 font-mono text-white">{bond.yield.toFixed(2)}%</td>
                      <td className={`text-right py-3 font-mono ${
                        bond.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {bond.change > 0 ? '+' : ''}{bond.change.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Treasury Bills Widget */}
        <div className="widget bg-gray-800 rounded-lg border border-gray-700">
          <div className="widget-header p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Treasury Bills</h2>
            <p className="text-blue-300 text-sm mt-1">Click any row for TreasuryDirect auctions</p>
          </div>
          <div className="widget-content p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-blue-300 font-medium">Maturity</th>
                    <th className="text-right py-3 text-blue-300 font-medium">Discount Rate</th>
                    <th className="text-right py-3 text-blue-300 font-medium">Investment Rate</th>
                    <th className="text-right py-3 text-blue-300 font-medium">Last Auction</th>
                  </tr>
                </thead>
                <tbody>
                  {tBills.map((bill) => (
                    <tr 
                      key={bill.maturity} 
                      className="border-b border-gray-700/50 hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => handleSourceClick(getRowSourceUrl(bill.maturity))}
                    >
                      <td className="py-3 text-white">
                        <div className="font-medium">{bill.maturity}</div>
                        <div className="text-xs text-blue-400">Click for auctions</div>
                      </td>
                      <td className="text-right py-3 font-mono text-white">{bill.discountRate.toFixed(2)}%</td>
                      <td className="text-right py-3 font-mono text-white">{bill.investmentRate.toFixed(2)}%</td>
                      <td className="text-right py-3 text-sm text-blue-200">{bill.lastAuctionDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Yield Curve Widget */}
        <div className="widget bg-gray-800 rounded-lg border border-gray-700 lg:col-span-2">
          <div className="widget-header p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Yield Curve Analysis</h2>
            <p className="text-blue-300 text-sm mt-1">Click any point on the curve for detailed FRED data</p>
          </div>
          <div className="widget-content p-6">
            <YieldCurveChart data={yieldCurve} />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="curve-metric p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                <div className="metric-label text-sm text-blue-300">Curve Type</div>
                <div className="metric-value font-semibold text-white">Inverted</div>
              </div>
              <div className="curve-metric p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                <div className="metric-label text-sm text-blue-300">10Y-2Y Spread</div>
                <div className="metric-value font-semibold text-red-400">-0.24%</div>
              </div>
              <div className="curve-metric p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                <div className="metric-label text-sm text-blue-300">Steepest Point</div>
                <div className="metric-value font-semibold text-white">3M to 1Y (+0.53%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Commentary */}
        <div className="widget bg-gray-800 rounded-lg border border-gray-700 lg:col-span-2">
          <div className="widget-header p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Market Commentary & Sources</h2>
          </div>
          <div className="widget-content p-6">
            <div className="prose max-w-none">
              <p className="text-blue-100 mb-4 leading-relaxed">
                The yield curve remains inverted with the 2-year yield trading above the 10-year yield, 
                historically a reliable indicator of potential economic recession. All data points are linked 
                directly to their official sources for verification and deeper analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-3 text-white text-lg">Official Data Sources</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-center justify-between group cursor-pointer hover:bg-gray-750 p-2 rounded" onClick={() => handleSourceClick('https://www.treasurydirect.gov/')}>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        TreasuryDirect.gov
                      </span>
                      <span className="text-blue-400 text-xs group-hover:underline">Visit →</span>
                    </li>
                    <li className="flex items-center justify-between group cursor-pointer hover:bg-gray-750 p-2 rounded" onClick={() => handleSourceClick('https://fred.stlouisfed.org/')}>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        FRED Economic Data
                      </span>
                      <span className="text-blue-400 text-xs group-hover:underline">Visit →</span>
                    </li>
                    <li className="flex items-center justify-between group cursor-pointer hover:bg-gray-750 p-2 rounded" onClick={() => handleSourceClick('https://www.federalreserve.gov/')}>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Federal Reserve
                      </span>
                      <span className="text-blue-400 text-xs group-hover:underline">Visit →</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-white text-lg">Interactive Features</h4>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Click any data point for detailed source
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Hover over chart points for information
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      All links open in new tabs for convenience
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Attribution */}
      <div className="mt-8 text-center text-sm text-blue-400">
        Data sources: U.S. Treasury, Federal Reserve, FRED Economic Data | All data points are clickable for verification
      </div>
    </div>
  );
};

export default BondMarketDashboard;