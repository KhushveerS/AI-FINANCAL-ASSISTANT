import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ETFHeatmap from "@/components/widgets/ETFHeatmap";
import Navbar from "@/components/dashboard/Navbar";
import { useState, useEffect } from "react";
import { Search, TrendingUp, AlertTriangle, BarChart3, Flame, Trophy, TrendingDown, Clock, Zap, Building2, Globe, Cpu, Heart, Car, Plane, ShoppingCart, DollarSign, PieChart, Target, Shield, Lightbulb } from "lucide-react";

interface ETFAnalysis {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  keyMetrics: {
    expenseRatio: number;
    assets: string;
    yield: number;
    volume: string;
    peRatio: number;
    holdings: number;
  };
  sectorAllocation: {
    sector: string;
    percentage: number;
  }[];
  topHoldings: string[];
  recommendations: string[];
}

interface TopETF {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  assets: string;
  category: string;
  expenseRatio: number;
}

interface SectorPerformance {
  sector: string;
  performance: number;
  etfCount: number;
  trend: 'up' | 'down' | 'neutral';
}

interface ETFNews {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  relatedSectors: string[];
}

export default function ETFPage() {
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState<ETFAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topETFs, setTopETFs] = useState<TopETF[]>([]);
  const [sectorPerformance, setSectorPerformance] = useState<SectorPerformance[]>([]);
  const [etfNews, setETFNews] = useState<ETFNews[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<'overview' | 'sectors' | 'analysis'>('overview');

  // ETF categories
  const categories = [
    { id: 'all', name: 'All ETFs', icon: PieChart },
    { id: 'tech', name: 'Technology', icon: Cpu },
    { id: 'health', name: 'Healthcare', icon: Heart },
    { id: 'finance', name: 'Financial', icon: Building2 },
    { id: 'energy', name: 'Energy', icon: Zap },
    { id: 'consumer', name: 'Consumer', icon: ShoppingCart },
    { id: 'industrial', name: 'Industrial', icon: Car },
    { id: 'international', name: 'International', icon: Globe }
  ];

  // Mock data for top ETFs
  const generateMockETFs = () => {
    const etfData = [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Broad Market' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Technology' },
      { symbol: 'IWM', name: 'iShares Russell 2000 ETF', category: 'Small Cap' },
      { symbol: 'EEM', name: 'iShares MSCI Emerging Markets', category: 'International' },
      { symbol: 'XLK', name: 'Technology Select Sector SPDR', category: 'Technology' },
      { symbol: 'XLV', name: 'Health Care Select Sector SPDR', category: 'Healthcare' },
      { symbol: 'XLF', name: 'Financial Select Sector SPDR', category: 'Financial' },
      { symbol: 'XLE', name: 'Energy Select Sector SPDR', category: 'Energy' },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market', category: 'Broad Market' },
      { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', category: 'Broad Market' }
    ];

    return etfData.map(etf => ({
      ...etf,
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.3) * 10,
      changePercent: (Math.random() - 0.3) * 8,
      volume: `${(Math.random() * 50 + 5).toFixed(1)}M`,
      assets: `$${(Math.random() * 400 + 50).toFixed(1)}B`,
      expenseRatio: Math.random() * 0.5 + 0.03
    }));
  };

  // Mock sector performance
  const mockSectorPerformance: SectorPerformance[] = [
    { sector: 'Technology', performance: 12.5, etfCount: 45, trend: 'up' },
    { sector: 'Healthcare', performance: 8.2, etfCount: 32, trend: 'up' },
    { sector: 'Financial', performance: 5.7, etfCount: 28, trend: 'up' },
    { sector: 'Energy', performance: -3.2, etfCount: 18, trend: 'down' },
    { sector: 'Consumer', performance: 2.1, etfCount: 25, trend: 'up' },
    { sector: 'Industrial', performance: 4.8, etfCount: 22, trend: 'up' },
    { sector: 'Utilities', performance: 1.3, etfCount: 15, trend: 'neutral' },
    { sector: 'Real Estate', performance: -1.5, etfCount: 20, trend: 'down' }
  ];

  // Mock ETF news
  const mockETFNews: ETFNews[] = [
    {
      id: '1',
      title: 'New ESG-focused ETF Launches with $2B in Initial Assets',
      source: 'ETF.com',
      timestamp: '3 hours ago',
      impact: 'high',
      relatedSectors: ['ESG', 'Broad Market']
    },
    {
      id: '2',
      title: 'Technology ETFs See Record Inflows Amid AI Boom',
      source: 'Bloomberg',
      timestamp: '5 hours ago',
      impact: 'high',
      relatedSectors: ['Technology', 'AI']
    },
    {
      id: '3',
      title: 'Bond ETF Trading Volume Hits All-Time High',
      source: 'Financial Times',
      timestamp: '8 hours ago',
      impact: 'medium',
      relatedSectors: ['Bonds', 'Fixed Income']
    },
    {
      id: '4',
      title: 'Sustainable Investing ETFs Outperform Traditional Benchmarks',
      source: 'WSJ',
      timestamp: '1 day ago',
      impact: 'medium',
      relatedSectors: ['ESG', 'Sustainable']
    }
  ];

  useEffect(() => {
    setTopETFs(generateMockETFs());
    setSectorPerformance(mockSectorPerformance);
    setETFNews(mockETFNews);
  }, []);

  const analyzeETF = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError('');
    setActiveView('analysis');
    
    try {
      const mockData: ETFAnalysis = {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} ETF Trust`,
        currentPrice: Math.random() * 500 + 50,
        priceChange: (Math.random() - 0.3) * 10,
        priceChangePercent: (Math.random() - 0.3) * 8,
        analysis: `The ${symbol.toUpperCase()} ETF demonstrates strong diversification benefits with exposure to high-growth sectors. The fund's low expense ratio and consistent performance make it an attractive core holding for long-term investors.`,
        sentiment: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'neutral' : 'bearish',
        keyMetrics: {
          expenseRatio: Math.random() * 0.2 + 0.03,
          assets: `$${(Math.random() * 300 + 20).toFixed(1)}B`,
          yield: Math.random() * 4 + 1,
          volume: `${(Math.random() * 20 + 2).toFixed(1)}M`,
          peRatio: Math.random() * 20 + 15,
          holdings: Math.floor(Math.random() * 2000) + 500
        },
        sectorAllocation: [
          { sector: 'Technology', percentage: 25.5 },
          { sector: 'Healthcare', percentage: 18.2 },
          { sector: 'Financial', percentage: 15.7 },
          { sector: 'Consumer', percentage: 12.3 },
          { sector: 'Industrial', percentage: 9.8 },
          { sector: 'Other', percentage: 18.5 }
        ],
        topHoldings: [
          "Apple Inc. (AAPL)",
          "Microsoft Corporation (MSFT)",
          "Amazon.com Inc. (AMZN)",
          "NVIDIA Corporation (NVDA)",
          "Alphabet Inc. (GOOGL)"
        ],
        recommendations: [
          "Consider as core portfolio holding for diversification",
          "Monitor sector rotation trends for optimal entry points",
          "Rebalance quarterly to maintain target allocation",
          "Compare expense ratio with similar ETF offerings"
        ]
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysis(mockData);
    } catch (err) {
      setError('Failed to fetch ETF analysis. Please try again.');
      console.error('Error analyzing ETF:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPerformanceColor = (performance: number) => {
    return performance >= 0 ? 'text-white' : 'text-black';
  };

  const filteredETFs = selectedCategory === 'all' 
    ? topETFs 
    : topETFs.filter(etf => 
        etf.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PieChart className="w-8 h-8" />
            ETF Market Intelligence
          </h1>
          <p className="text-muted-foreground">
            Comprehensive ETF analysis, sector performance, and portfolio optimization tools
          </p>
        </div>

        {/* Quick Analysis Bar */}
        <Card className="mb-6 bg-black border-blue-200 shadow-card ">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 gradient-to-r from-blue-50 to-indigo-50">
                <Input
                  placeholder="Search ETFs (e.g., SPY, QQQ, VTI)..."
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeETF()}
                  className="h-12 text-lg border-blue-200 bg-white text-black"
                />
              </div>
              <Button 
                onClick={analyzeETF} 
                disabled={loading}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Analyze ETF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
          {[
            { id: 'overview', name: 'Market Overview', icon: BarChart3 },
            { id: 'sectors', name: 'Sector Analysis', icon: Building2 },
            { id: 'analysis', name: 'ETF Analysis', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-md flex-1 justify-center transition-colors ${
                activeView === tab.id
                  ? 'bg-background shadow-sm border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveView(tab.id as any)}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Main Content */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <category.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing ETFs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-600" />
                    Top Performing ETFs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredETFs.slice(0, 6).map((etf, index) => (
                      <div key={etf.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {etf.symbol}
                          </Badge>
                          <div>
                            <div className="font-semibold text-sm">{etf.name}</div>
                            <div className="text-xs text-muted-foreground">{etf.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getPerformanceColor(etf.changePercent)}`}>
                            {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-sm">${etf.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sector Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Sector Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sectorPerformance.map((sector) => (
                      <div key={sector.sector} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {getTrendIcon(sector.trend)}
                            <span className="font-medium text-sm">{sector.sector}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${getPerformanceColor(sector.performance)}`}>
                              {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(1)}%
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {sector.etfCount} ETFs
                            </Badge>
                          </div>
                        </div>
                        <Progress 
                          value={Math.abs(sector.performance) * 10} 
                          className={`h-1 ${
                            sector.performance >= 0 ? 'bg-green-200' : 'bg-red-200'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap and News */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>ETF Market Heatmap</CardTitle>
                </CardHeader>
                <CardContent className="h-[800px] p-0">
                  <ETFHeatmap />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    ETF News & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {etfNews.map((news) => (
                      <div key={news.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={news.impact === 'high' ? 'destructive' : 'outline'}>
                            {news.impact}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {news.timestamp}
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm mb-2">{news.title}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{news.source}</span>
                          <div className="flex gap-1">
                            {news.relatedSectors.slice(0, 2).map(sector => (
                              <Badge key={sector} variant="secondary" className="text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'sectors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detailed Sector Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Sector Allocation Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sectorPerformance.map((sector) => (
                      <div key={sector.sector} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            {getTrendIcon(sector.trend)}
                            <span className="font-semibold">{sector.sector}</span>
                          </div>
                          <Badge className={getPerformanceColor(sector.performance)}>
                            {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Top ETF</div>
                            <div className="font-semibold">
                              {sector.sector === 'Technology' ? 'XLK' : 
                               sector.sector === 'Healthcare' ? 'XLV' :
                               sector.sector === 'Financial' ? 'XLF' : 'SPY'}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">ETF Count</div>
                            <div className="font-semibold">{sector.etfCount}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Investment Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Smart Beta Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Low Volatility', description: 'ETFs focusing on stable, low-risk stocks', symbol: 'USMV' },
                      { name: 'Quality Factor', description: 'Companies with strong balance sheets', symbol: 'QUAL' },
                      { name: 'Momentum', description: 'Stocks with positive price trends', symbol: 'MTUM' },
                      { name: 'Value', description: 'Undervalued companies based on fundamentals', symbol: 'VLUE' }
                    ].map((strategy) => (
                      <div key={strategy.name} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="bg-green-50">
                            {strategy.symbol}
                          </Badge>
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                        <h4 className="font-semibold mb-1">{strategy.name}</h4>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'analysis' && (
          <div className="space-y-6">
            {analysis ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-3">
                          {analysis.symbol}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            ETF
                          </Badge>
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{analysis.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">${analysis.currentPrice.toFixed(2)}</div>
                        <div className={`text-lg font-semibold ${getPerformanceColor(analysis.priceChangePercent)}`}>
                          {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChange.toFixed(2)} (
                          {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChangePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Key Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Fund Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(analysis.keyMetrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <Badge variant="secondary">
                            {typeof value === 'number' && key.includes('Ratio') ? value.toFixed(3) + '%' : value}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Sector Allocation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Sector Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.sectorAllocation.map((sector) => (
                          <div key={sector.sector} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{sector.sector}</span>
                              <span className="font-semibold">{sector.percentage}%</span>
                            </div>
                            <Progress value={sector.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Holdings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Top Holdings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.topHoldings.map((holding, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <Badge variant="outline" className="bg-blue-50">
                              #{index + 1}
                            </Badge>
                            <span className="text-sm">{holding}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Investment Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-blue-50">
                          <div className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-900">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <PieChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analyze an ETF</h3>
                  <p className="text-muted-foreground mb-4">
                    Search for any ETF to get detailed analysis and portfolio insights
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {['SPY', 'QQQ', 'VTI', 'IWM'].map((popularETF) => (
                      <Button
                        key={popularETF}
                        variant="outline"
                        onClick={() => {
                          setSymbol(popularETF);
                          analyzeETF();
                        }}
                      >
                        {popularETF}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}