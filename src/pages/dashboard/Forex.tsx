import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ForexScreener from "@/components/widgets/ForexScreener";
import Navbar from "@/components/dashboard/Navbar";
import { useState, useEffect } from "react";
import { Search, TrendingUp, AlertTriangle, BarChart3, Flame, Trophy, TrendingDown, Clock, Zap, ArrowUp, ArrowDown, Globe, Currency, Target, Shield, Lightbulb, PieChart } from "lucide-react";

interface ForexAnalysis {
  pair: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  keyMetrics: {
    dailyRange: number;
    volatility: string;
    spread: number;
    support: number;
    resistance: number;
    trend: 'uptrend' | 'downtrend' | 'ranging';
  };
  technicals: {
    rsi: number;
    macd: string;
    movingAverage: string;
  };
  recommendations: string[];
}

interface TopPair {
  pair: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  category: string;
}

interface EconomicEvent {
  id: string;
  currency: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  previous: string;
  forecast: string;
}

interface ForexSignal {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  pair: string;
  recommendation: string;
  confidence: number;
  timeframe: string;
  entry: number;
  target: number;
  stopLoss: number;
}

export default function ForexPage() {
  const [pair, setPair] = useState('');
  const [analysis, setAnalysis] = useState<ForexAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topGainers, setTopGainers] = useState<TopPair[]>([]);
  const [topLosers, setTopLosers] = useState<TopPair[]>([]);
  const [forexSignals, setForexSignals] = useState<ForexSignal[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'screener' | 'analysis'>('screener');
  const [majorPairs, setMajorPairs] = useState<TopPair[]>([]);

  // Mock data for forex pairs
  const generateMockForexPairs = (count: number, type: 'gainers' | 'losers') => {
    const forexData = [
      { pair: 'EUR/USD', name: 'Euro vs US Dollar', category: 'Major' },
      { pair: 'GBP/USD', name: 'British Pound vs US Dollar', category: 'Major' },
      { pair: 'USD/JPY', name: 'US Dollar vs Japanese Yen', category: 'Major' },
      { pair: 'USD/CHF', name: 'US Dollar vs Swiss Franc', category: 'Major' },
      { pair: 'AUD/USD', name: 'Australian Dollar vs US Dollar', category: 'Major' },
      { pair: 'USD/CAD', name: 'US Dollar vs Canadian Dollar', category: 'Major' },
      { pair: 'NZD/USD', name: 'New Zealand Dollar vs US Dollar', category: 'Major' },
      { pair: 'EUR/GBP', name: 'Euro vs British Pound', category: 'Cross' },
      { pair: 'EUR/JPY', name: 'Euro vs Japanese Yen', category: 'Cross' },
      { pair: 'GBP/JPY', name: 'British Pound vs Japanese Yen', category: 'Cross' },
      { pair: 'AUD/JPY', name: 'Australian Dollar vs Japanese Yen', category: 'Cross' },
      { pair: 'USD/MXN', name: 'US Dollar vs Mexican Peso', category: 'Exotic' }
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const forex = forexData[i % forexData.length];
      const basePrice = forex.pair.includes('JPY') ? 100 : 1;
      const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
      const changePercent = type === 'gainers' ? Math.random() * 1.5 + 0.1 : -(Math.random() * 1.2 + 0.1);
      
      return {
        ...forex,
        price: price,
        change: (price * changePercent) / 100,
        changePercent: changePercent,
        volume: `${(Math.random() * 50 + 10).toFixed(0)}B`
      };
    });
  };

  // Mock forex signals
  const mockForexSignals: ForexSignal[] = [
    {
      id: '1',
      type: 'buy',
      pair: 'EUR/USD',
      recommendation: "Bullish breakout above 1.0850 resistance",
      confidence: 85,
      timeframe: '4H',
      entry: 1.0855,
      target: 1.0920,
      stopLoss: 1.0820
    },
    {
      id: '2',
      type: 'sell',
      pair: 'USD/JPY',
      recommendation: "Overbought conditions with bearish divergence",
      confidence: 78,
      timeframe: '1H',
      entry: 148.20,
      target: 147.50,
      stopLoss: 148.60
    },
    {
      id: '3',
      type: 'buy',
      pair: 'GBP/USD',
      recommendation: "Strong support at 1.2650, bullish momentum building",
      confidence: 82,
      timeframe: 'Daily',
      entry: 1.2660,
      target: 1.2750,
      stopLoss: 1.2620
    },
    {
      id: '4',
      type: 'hold',
      pair: 'AUD/USD',
      recommendation: "Range-bound between 0.6550-0.6650, wait for breakout",
      confidence: 75,
      timeframe: '4H',
      entry: 0.6600,
      target: 0.6650,
      stopLoss: 0.6550
    }
  ];

  // Mock economic events
  const mockEconomicEvents: EconomicEvent[] = [
    {
      id: '1',
      currency: 'USD',
      event: 'Federal Reserve Interest Rate Decision',
      impact: 'high',
      timestamp: 'Today, 14:00 EST',
      previous: '5.50%',
      forecast: '5.50%'
    },
    {
      id: '2',
      currency: 'EUR',
      event: 'ECB President Speech',
      impact: 'high',
      timestamp: 'Today, 08:30 EST',
      previous: '-',
      forecast: '-'
    },
    {
      id: '3',
      currency: 'GBP',
      event: 'CPI Inflation Data',
      impact: 'medium',
      timestamp: 'Tomorrow, 04:30 EST',
      previous: '4.0%',
      forecast: '3.8%'
    },
    {
      id: '4',
      currency: 'JPY',
      event: 'Bank of Japan Policy Statement',
      impact: 'high',
      timestamp: 'Tomorrow, 23:50 EST',
      previous: '-0.10%',
      forecast: '-0.10%'
    },
    {
      id: '5',
      currency: 'AUD',
      event: 'Employment Change',
      impact: 'medium',
      timestamp: 'Today, 20:30 EST',
      previous: '55K',
      forecast: '45K'
    }
  ];

  // Major pairs for quick overview
  const mockMajorPairs: TopPair[] = [
    { pair: 'EUR/USD', name: 'Euro vs US Dollar', price: 1.0854, change: 0.0023, changePercent: 0.21, volume: '45.2B', category: 'Major' },
    { pair: 'GBP/USD', name: 'British Pound vs US Dollar', price: 1.2678, change: 0.0015, changePercent: 0.12, volume: '32.1B', category: 'Major' },
    { pair: 'USD/JPY', name: 'US Dollar vs Japanese Yen', price: 148.23, change: -0.45, changePercent: -0.30, volume: '38.7B', category: 'Major' },
    { pair: 'USD/CHF', name: 'US Dollar vs Swiss Franc', price: 0.8792, change: -0.0012, changePercent: -0.14, volume: '15.3B', category: 'Major' }
  ];

  useEffect(() => {
    // Initialize with mock data
    setTopGainers(generateMockForexPairs(8, 'gainers'));
    setTopLosers(generateMockForexPairs(8, 'losers'));
    setForexSignals(mockForexSignals);
    setEconomicEvents(mockEconomicEvents);
    setMajorPairs(mockMajorPairs);
  }, []);

  const analyzeForex = async () => {
    if (!pair.trim()) return;
    
    setLoading(true);
    setError('');
    setActiveTab('analysis');
    
    try {
      // Mock data for forex analysis
      const isMajor = pair.includes('/');
      const basePrice = pair.includes('JPY') ? 148.00 : 1.0800;
      
      const mockData: ForexAnalysis = {
        pair: pair.toUpperCase(),
        name: `${pair.toUpperCase()} Currency Pair`,
        currentPrice: basePrice + (Math.random() - 0.5) * basePrice * 0.02,
        priceChange: (Math.random() - 0.5) * basePrice * 0.01,
        priceChangePercent: (Math.random() - 0.5) * 0.8,
        analysis: `Technical analysis shows ${pair.toUpperCase()} is in a ${Math.random() > 0.5 ? 'bullish' : 'bearish'} phase with strong ${Math.random() > 0.5 ? 'support' : 'resistance'} levels holding. The pair shows ${Math.random() > 0.5 ? 'increasing' : 'decreasing'} momentum with key economic events likely to drive direction.`,
        sentiment: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'neutral' : 'bearish',
        keyMetrics: {
          dailyRange: Math.random() * 0.015 + 0.005,
          volatility: Math.random() > 0.5 ? 'High' : 'Medium',
          spread: Math.random() * 2 + 0.5,
          support: basePrice * 0.995,
          resistance: basePrice * 1.005,
          trend: Math.random() > 0.6 ? 'uptrend' : Math.random() > 0.3 ? 'downtrend' : 'ranging'
        },
        technicals: {
          rsi: Math.random() * 30 + 35,
          macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
          movingAverage: Math.random() > 0.5 ? 'Bullish Crossover' : 'Bearish Crossover'
        },
        recommendations: [
          "Monitor key support and resistance levels for breakout",
          "Consider position sizing based on volatility",
          "Set appropriate stop-loss to manage risk",
          "Watch for economic calendar events this week"
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysis(mockData);
    } catch (err) {
      setError('Failed to fetch forex analysis. Please try again.');
      console.error('Error analyzing forex:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-100 text-green-800 border-green-200';
      case 'sell': return 'bg-red-100 text-red-800 border-red-200';
      case 'hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatForexPrice = (price: number, pair: string) => {
    const decimals = pair.includes('JPY') ? 2 : 4;
    return price.toFixed(decimals);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'uptrend': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'downtrend': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="w-8 h-8" />
            Forex Market
          </h1>
          <p className="text-muted-foreground">
            Real-time currency pair analysis, trading signals, and economic calendar
          </p>
        </div>

        {/* Search and Tabs Section */}
        <Card className="mb-6 bg-gradient-surface border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter currency pair (e.g., EUR/USD, GBP/JPY, USD/CAD)"
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeForex()}
                  className="h-12 text-lg"
                />
              </div>
              <Button 
                onClick={analyzeForex} 
                disabled={loading}
                className="h-12 px-8"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Analyze Pair
              </Button>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex border-b border-border">
              <button
                className={`px-4 py-2 font-medium flex items-center gap-2 ${
                  activeTab === 'screener'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('screener')}
              >
                <Currency className="w-4 h-4" />
                Market Screener
              </button>
              <button
                className={`px-4 py-2 font-medium flex items-center gap-2 ${
                  activeTab === 'analysis'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('analysis')}
              >
                <BarChart3 className="w-4 h-4" />
                Pair Analysis
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        {activeTab === 'screener' ? (
          <>
            {/* Market Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Top Gainers */}
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Trophy className="w-5 h-5" />
                    Top Gainers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topGainers.map((currency, index) => (
                      <div key={currency.pair} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100  bg-gradient-to-r from-gray-800 to-gray-900">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            #{index + 1}
                          </Badge>
                          <div>
                            <div className="font-semibold">{currency.pair}</div>
                            <div className="text-xs text-muted-foreground">{currency.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600 flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            +{currency.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-sm">{formatForexPrice(currency.price, currency.pair)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trading Signals & Major Pairs */}
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Live Trading Signals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">MAJOR PAIRS</h4>
                    <div className="space-y-2">
                      {majorPairs.map((pair) => (
                        <div key={pair.pair} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-sm">{pair.pair}</div>
                            <Badge variant="outline" className="text-xs">{pair.category}</Badge>
                          </div>
                          <div className={`text-sm font-semibold ${pair.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatForexPrice(pair.price, pair.pair)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">ACTIVE SIGNALS</h4>
                    <div className="space-y-2">
                      {forexSignals.map((signal) => (
                        <div key={signal.id} className="p-2 border rounded-lg bg-gray-900">
                          <div className="flex justify-between items-start mb-1">
                            <Badge className={getSuggestionColor(signal.type)}>
                              {signal.type.toUpperCase()}
                            </Badge>
                            <div className="text-xs text-muted-foreground">{signal.timeframe}</div>
                          </div>
                          <div className="font-semibold mb-1 text-white">{signal.pair}</div>
                          <p className="text-xs text-muted-foreground mb-1">{signal.recommendation}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span>Entry: {formatForexPrice(signal.entry, signal.pair)}</span>
                            <span className="text-blue-600">{signal.confidence}% conf</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Losers */}
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <TrendingDown className="w-5 h-5" />
                    Top Losers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosers.map((currency, index) => (
                      <div key={currency.pair} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100  bg-gradient-to-r from-gray-800 to-gray-900">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            #{index + 1}
                          </Badge>
                          <div>
                            <div className="font-semibold">{currency.pair}</div>
                            <div className="text-xs text-muted-foreground">{currency.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600 flex items-center gap-1">
                            <ArrowDown className="w-3 h-3" />
                            {currency.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-sm">{formatForexPrice(currency.price, currency.pair)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Screener Section */}
            <Card className="mb-6 bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Forex Market Screener</CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-0">
                <ForexScreener />
              </CardContent>
            </Card>

            {/* Economic Calendar */}
            <Card className="bg-gradient-surface border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Economic Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {economicEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg bg-gray-900">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-black">
                            {event.currency}
                          </Badge>
                          <Badge className={getImpactBadge(event.impact)}>
                            {event.impact} impact
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{event.timestamp}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold mb-3">{event.event}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Previous</div>
                          <div className="font-semibold">{event.previous}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Forecast</div>
                          <div className="font-semibold">{event.forecast}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Forex Analysis Section */
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Pair Overview */}
                <Card className="bg-gradient-surface border-border/50 shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-3">
                          {analysis.pair}
                          <Badge className={getSentimentColor(analysis.sentiment)}>
                            {analysis.sentiment.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{analysis.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{formatForexPrice(analysis.currentPrice, analysis.pair)}</div>
                        <div className={`text-lg font-semibold ${
                          analysis.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChange.toFixed(4)} (
                          {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChangePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Key Metrics */}
                  <Card className="lg:col-span-1 bg-gradient-surface border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Trading Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>Daily Range</span>
                        <Badge variant="secondary">+{analysis.keyMetrics.dailyRange.toFixed(4)}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>Volatility</span>
                        <Badge variant="secondary">{analysis.keyMetrics.volatility}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>Average Spread</span>
                        <Badge variant="secondary">{analysis.keyMetrics.spread.toFixed(1)} pips</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>Support Level</span>
                        <Badge variant="secondary">{formatForexPrice(analysis.keyMetrics.support, analysis.pair)}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span>Resistance Level</span>
                        <Badge variant="secondary">{formatForexPrice(analysis.keyMetrics.resistance, analysis.pair)}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Technical Analysis */}
                  <Card className="lg:col-span-2 bg-gradient-surface border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Technical Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-900 leading-relaxed">{analysis.analysis}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-sm text-muted-foreground mb-1">RSI</div>
                          <div className={`text-xl font-bold ${
                            analysis.technicals.rsi > 70 ? 'text-red-600' : 
                            analysis.technicals.rsi < 30 ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {analysis.technicals.rsi.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {analysis.technicals.rsi > 70 ? 'Overbought' : 
                             analysis.technicals.rsi < 30 ? 'Oversold' : 'Neutral'}
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-sm text-muted-foreground mb-1">MACD</div>
                          <div className={`text-xl font-bold ${
                            analysis.technicals.macd === 'Bullish' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {analysis.technicals.macd}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Momentum</div>
                        </div>
                        
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-sm text-muted-foreground mb-1">Trend</div>
                          <div className="flex items-center justify-center gap-1">
                            {getTrendIcon(analysis.keyMetrics.trend)}
                            <span className="text-xl font-bold capitalize">{analysis.keyMetrics.trend}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Primary Direction</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Trading Recommendations:</h4>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              /* Placeholder when no analysis */
              <Card className="bg-gradient-surface border-border/50 shadow-card">
                <CardContent className="p-12 text-center">
                  <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analyze a Currency Pair</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter a forex pair above to get technical analysis and trading signals
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'].map((popularPair) => (
                      <Button
                        key={popularPair}
                        variant="outline"
                        onClick={() => {
                          setPair(popularPair);
                          analyzeForex();
                        }}
                      >
                        {popularPair}
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