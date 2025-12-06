import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Minus, Activity, RefreshCw, Quote, ExternalLink, Loader2, Brain, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/dashboard/Navbar";
import { 
  getMarketSentiment, 
  generateExpertReviews,
  type SectorSentiment, 
  type ExpertReview 
} from "@/lib/sentimentAnalysisService";

const getSentimentStyle = (sentiment: string) => {
  switch (sentiment) {
    case "overhyped":
      return {
        badge: "bg-red-600/20 text-red-400 border border-red-600/40",
        label: "OVERHYPED",
        icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
      };
    case "underhyped":
      return {
        badge: "bg-green-600/20 text-green-400 border border-green-600/40",
        label: "UNDERHYPED",
        icon: <TrendingUp className="h-4 w-4 text-green-400" />,
      };
    default:
      return {
        badge: "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40",
        label: "NEUTRAL",
        icon: <Minus className="h-4 w-4 text-yellow-400" />,
      };
  }
};

const getSourceTypeStyle = (type: string) => {
  switch (type) {
    case "interview":
      return "bg-blue-600/20 text-blue-400 border-blue-600/40";
    case "article":
      return "bg-purple-600/20 text-purple-400 border-purple-600/40";
    case "earnings-call":
      return "bg-green-600/20 text-green-400 border-green-600/40";
    case "conference":
      return "bg-orange-600/20 text-orange-400 border-orange-600/40";
    case "social-media":
      return "bg-pink-600/20 text-pink-400 border-pink-600/40";
    default:
      return "bg-gray-600/20 text-gray-400 border-gray-600/40";
  }
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`w-4 h-4 rounded-full ${
            star <= rating ? "bg-yellow-400" : "bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

export default function MarketSentiment() {
  const [sentiments, setSentiments] = useState<SectorSentiment[]>([]);
  const [expertReviews, setExpertReviews] = useState<ExpertReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const loadSentimentData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      toast({
        title: "Loading Market Sentiment",
        description: "Fetching real-time sector analysis...",
      });

      // Fetch market sentiment
      const sentimentData = await getMarketSentiment(forceRefresh);
      setSentiments(sentimentData);

      // Generate expert reviews
      const reviews = await generateExpertReviews(sentimentData);
      setExpertReviews(reviews);

      toast({
        title: "Data Loaded",
        description: `Analyzed ${sentimentData.length} sectors with AI-powered insights.`,
      });
    } catch (error: any) {
      console.error("Error loading sentiment data:", error);
      toast({
        title: "Error Loading Data",
        description: error.message || "Failed to load market sentiment. Using fallback data.",
        variant: "destructive",
      });
      
      // Set empty arrays on error - component will show loading state
      setSentiments([]);
      setExpertReviews([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSentimentData();
  }, []);

  const handleExpertClick = (review: ExpertReview) => {
    if (review.sourceUrl && review.sourceUrl !== '#') {
      window.open(review.sourceUrl, '_blank', 'noopener,noreferrer');
      toast({
        title: "Opening Source",
        description: `Redirecting to ${review.source}`,
      });
    } else {
      toast({
        title: "Source Unavailable",
        description: "Source link not available for this review.",
      });
    }
  };

  const handleRefresh = () => {
    loadSentimentData(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-[#0D0F1A] border border-gray-800/50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-cyan-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">Market Sentiment Overview</h2>
                    <p className="text-sm text-gray-400">
                      Real-time AI-powered analysis of sector hype levels and bubble risk
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading || isRefreshing}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh Data
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-cyan-600/10 border border-cyan-600/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-cyan-400 font-semibold mb-1">AI-Powered Analysis</p>
                    <p className="text-xs text-gray-400">
                      This analysis uses real market data and Google Gemini AI to provide current sector sentiment, 
                      bubble risk assessment, and momentum indicators. Data is updated every 5 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-[#0D0F1A] border border-gray-800/50 shadow-md">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-400">Loading real-time market sentiment analysis...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment as we analyze all sectors</p>
              </CardContent>
            </Card>
          )}

          {/* Sentiment Cards */}
          {!isLoading && sentiments.length > 0 && (
            <div className="grid gap-5">
              {sentiments.map((sector, index) => {
                const style = getSentimentStyle(sector.sentiment);
                return (
                  <motion.div
                    key={sector.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-[#0D0F1A] border border-gray-800/50 shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300">
                      <CardContent className="p-6 space-y-4">
                        {/* Title + Badge */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-white">{sector.name}</h3>
                              {sector.marketCap && (
                                <Badge variant="outline" className="text-xs bg-gray-800/50 text-gray-400">
                                  {sector.marketCap}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{sector.description}</p>
                            {sector.priceChange !== undefined && (
                              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                {sector.currentPE && sector.historicalPE && (
                                  <span>
                                    P/E: {sector.currentPE.toFixed(1)} (Hist: {sector.historicalPE.toFixed(1)})
                                  </span>
                                )}
                                <span className={`font-medium ${
                                  sector.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {sector.priceChange >= 0 ? '+' : ''}{sector.priceChange.toFixed(2)}%
                                </span>
                              </div>
                            )}
                          </div>
                          <Badge className={`flex items-center gap-1 px-2 py-1 rounded-full ${style.badge}`}>
                            {style.icon}
                            {style.label}
                          </Badge>
                        </div>

                        {/* Progress Bars */}
                        <div className="grid md:grid-cols-2 gap-6 pt-3">
                          {/* Bubble Risk */}
                          <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>Bubble Risk</span>
                              <span className="text-white font-medium">{sector.bubbleRisk}%</span>
                            </div>
                            <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${sector.bubbleRisk}%` }}
                                transition={{ duration: 1 }}
                                className={`h-full rounded-full ${
                                  sector.bubbleRisk > 70
                                    ? "bg-red-500"
                                    : sector.bubbleRisk > 40
                                    ? "bg-yellow-400"
                                    : "bg-green-500"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Momentum */}
                          <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>Momentum</span>
                              <span
                                className={`font-medium ${
                                  sector.momentum >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {sector.momentum > 0 ? "+" : ""}
                                {sector.momentum}
                              </span>
                            </div>
                            <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.abs(sector.momentum)}%` }}
                                transition={{ duration: 1 }}
                                className={`h-full rounded-full ${
                                  sector.momentum > 0 ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* No Data State */}
          {!isLoading && sentiments.length === 0 && (
            <Card className="bg-[#0D0F1A] border border-gray-800/50 shadow-md">
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Unable to load market sentiment data</p>
                <p className="text-sm text-gray-500 mb-4">
                  Please check your API keys and try refreshing
                </p>
                <Button onClick={handleRefresh} className="bg-cyan-600 hover:bg-cyan-500">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Expert Reviews Section */}
          {!isLoading && expertReviews.length > 0 && (
            <Card className="bg-[#0D0F1A] border border-gray-800/50 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Quote className="h-6 w-6 text-cyan-400" />
                  <span>AI-Generated Expert Insights & Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {expertReviews.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border border-gray-800/50 rounded-lg p-4 bg-[#11131F] hover:bg-[#131625] transition-all duration-300 hover:border-cyan-600/30 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
                      onClick={() => handleExpertClick(review)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-semibold text-sm group-hover:bg-cyan-600/30 transition-colors">
                            {review.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                              {review.name}
                            </h3>
                            <p className="text-sm text-gray-400">{review.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-gray-400">{review.rating}/5</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-purple-600/20 text-purple-400 border-purple-600/40">
                            {review.sector}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-300 leading-relaxed mb-3 group-hover:text-gray-200 transition-colors">
                        {review.review}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSourceTypeStyle(review.sourceType)}`}
                          >
                            {review.sourceType.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">{review.source}</span>
                        </div>
                        {review.sourceUrl && review.sourceUrl !== '#' && (
                          <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium">View Source</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                        <span>{review.date}</span>
                        <div className="flex items-center gap-1">
                          <Brain className="w-4 h-4 text-cyan-400" />
                          <span>AI Analysis</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 border border-cyan-600/30 rounded-lg bg-cyan-600/10">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h4 className="font-semibold text-cyan-400 text-sm mb-1">ABOUT AI-GENERATED REVIEWS</h4>
                      <p className="text-sm text-gray-400">
                        Expert reviews are generated using AI analysis of current market conditions and sector data. 
                        These are simulated expert opinions based on real market sentiment and are for informational purposes only. 
                        They do not constitute actual investment advice from the named individuals or institutions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
