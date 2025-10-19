import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Minus, Activity, RefreshCw, Quote, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SectorSentiment {
  name: string;
  sentiment: "overhyped" | "underhyped" | "neutral";
  bubbleRisk: number;
  momentum: number;
  description: string;
}

interface ExpertReview {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
  sector: string;
  source: string;
  sourceUrl: string;
  sourceType: "interview" | "article" | "earnings-call" | "conference" | "social-media";
}

const defaultSentiments: SectorSentiment[] = [
  {
    name: "AI & Technology",
    sentiment: "overhyped",
    bubbleRisk: 78,
    momentum: 65,
    description:
      "Extremely high valuations with P/E ratios exceeding historical norms. Watch for correction signals.",
  },
  {
    name: "Gold & Precious Metals",
    sentiment: "neutral",
    bubbleRisk: 35,
    momentum: 15,
    description:
      "Stable safe-haven asset. Recent consolidation phase with moderate geopolitical support.",
  },
  {
    name: "Renewable Energy",
    sentiment: "underhyped",
    bubbleRisk: 22,
    momentum: 42,
    description:
      "Growing fundamentals with policy tailwinds. Attractive valuations relative to growth prospects.",
  },
  {
    name: "Cryptocurrency",
    sentiment: "overhyped",
    bubbleRisk: 85,
    momentum: 72,
    description:
      "Extreme speculation with high volatility. Regulatory uncertainty poses significant risks."  
  },
  {
    name: "Banking & Financial",
    sentiment: "underhyped",
    bubbleRisk: 25,
    momentum: 8,
    description:
      "Recovery from regional bank crisis. Higher interest rates improving margins."  
  },
  {
    name: "Healthcare & Biotech",
    sentiment: "neutral",
    bubbleRisk: 28,
    momentum: 25,
    description:
      "Defensive positioning with steady growth. Aging demographics provide long-term support."  
  }, 
  {
    name: "Defense & Aerospace",
    sentiment: "neutral",
    bubbleRisk: 32,
    momentum: 38,
    description:
      "Geopolitical tensions drive demand. Government contracts provide stability."  
  }, 
  {
    name: "Real Estate",
    sentiment: "underhyped",
    bubbleRisk: 18,
    momentum: -12,
    description:
      "Interest rate pressure creating opportunities. Commercial real estate shows stress but residential stabilizing."
  },
];

const expertReviews: ExpertReview[] = [
  {
    name: "Jamie Dimon",
    title: "CEO, JPMorgan Chase",
    avatar: "JD",
    rating: 4,
    review: "While AI shows tremendous promise, current valuations in the technology sector are disconnected from near-term fundamentals. We're advising clients to take a measured approach and focus on companies with proven revenue models and sustainable competitive advantages.",
    date: "2024-01-15",
    sector: "AI & Technology",
    source: "JPMorgan Q4 Earnings Call",
    sourceUrl: "https://www.jpmorganchase.com/ir/earnings",
    sourceType: "earnings-call"
  },
  {
    name: "Ray Dalio",
    title: "Founder, Bridgewater Associates",
    avatar: "RD",
    rating: 5,
    review: "Gold remains a crucial diversifier in any portfolio. With geopolitical tensions and persistent inflation, the neutral rating underestimates its strategic importance. We're increasing allocation to precious metals as hedge against currency debasement.",
    date: "2024-01-12",
    sector: "Gold & Precious Metals",
    source: "LinkedIn Post",
    sourceUrl: "https://www.linkedin.com/in/raydalio/posts",
    sourceType: "social-media"
  },
  {
    name: "Cathie Wood",
    title: "CEO, ARK Invest",
    avatar: "CW",
    rating: 5,
    review: "Renewable energy is massively underhyped given the convergence of technological innovation, policy support, and cost curves. The energy transition will create the largest investment opportunity of our generation. We're particularly bullish on energy storage and grid technology.",
    date: "2024-01-10",
    sector: "Renewable Energy",
    source: "ARK Invest Monthly Webinar",
    sourceUrl: "https://ark-invest.com/webinars",
    sourceType: "conference"
  },
  {
    name: "Warren Buffett",
    title: "Chairman, Berkshire Hathaway",
    avatar: "WB",
    rating: 2,
    review: "Cryptocurrency remains a speculative vehicle with no underlying productive value. We continue to avoid the space entirely. The bubble risk assessment at 85% might even be conservative given the lack of intrinsic value anchors.",
    date: "2024-01-08",
    sector: "Cryptocurrency",
    source: "CNBC Interview",
    sourceUrl: "https://www.cnbc.com/warren-buffett",
    sourceType: "interview"
  },
  {
    name: "David Solomon",
    title: "CEO, Goldman Sachs",
    avatar: "DS",
    rating: 4,
    review: "Banking sector sentiment is overly pessimistic. Higher interest rates are fundamentally positive for net interest margins, and credit quality remains strong. We see significant value in quality regional banks trading below tangible book value.",
    date: "2024-01-05",
    sector: "Banking & Financial",
    source: "Goldman Sachs Investor Day",
    sourceUrl: "https://www.goldmansachs.com/investor-relations",
    sourceType: "conference"
  },
  {
    name: "Lisa Su",
    title: "CEO, AMD",
    avatar: "LS",
    rating: 3,
    review: "The AI revolution is real and will transform every industry, but investors need to distinguish between infrastructure players and application companies. The semiconductor companies building the foundational technology have stronger moats and more predictable demand curves.",
    date: "2024-01-03",
    sector: "AI & Technology",
    source: "CES 2024 Keynote",
    sourceUrl: "https://ces.tech/Keynotes",
    sourceType: "conference"
  },
  {
    name: "Michael Burry",
    title: "Founder, Scion Asset Management",
    avatar: "MB",
    rating: 1,
    review: "The AI bubble resembles the dot-com mania of 2000. Companies with no clear path to profitability are being valued at astronomical multiples. The inevitable correction will be severe for overleveraged investors.",
    date: "2024-01-02",
    sector: "AI & Technology",
    source: "SEC Filing Analysis",
    sourceUrl: "https://www.sec.gov/edgar/searchedgar/companysearch",
    sourceType: "article"
  },
  {
    name: "Jenny Johnson",
    title: "CEO, Franklin Templeton",
    avatar: "JJ",
    rating: 4,
    review: "Real estate presents unique opportunities in the current cycle. While commercial office space faces challenges, industrial and residential sectors show strong fundamentals. Selective investing can yield significant returns.",
    date: "2023-12-28",
    sector: "Real Estate",
    source: "Bloomberg Interview",
    sourceUrl: "https://www.bloomberg.com/news/interviews",
    sourceType: "interview"
  }
];

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
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExpertClick = (review: ExpertReview) => {
    // Open source in new tab
    window.open(review.sourceUrl, '_blank', 'noopener,noreferrer');
    
    // Show toast notification
    toast({
      title: "Opening Source",
      description: `Redirecting to ${review.source}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#0D0F1A] border border-gray-800/50 shadow-md">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-cyan-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Market Sentiment Overview</h2>
              <p className="text-sm text-gray-400">
                Real-time analysis of sector hype levels and bubble risk.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="password"
              placeholder="Alpha Vantage API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-[#11131F] border-gray-700 text-gray-200 placeholder:text-gray-500 w-64"
            />
            <Button
              onClick={() =>
                toast({
                  title: "Demo Mode",
                  description: "Live API not connected yet.",
                })
              }
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Cards */}
      <div className="grid gap-5">
        {defaultSentiments.map((sector) => {
          const style = getSentimentStyle(sector.sentiment);
          return (
            <Card
              key={sector.name}
              className="bg-[#0D0F1A] border border-gray-800/50 shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300"
            >
              <CardContent className="p-6 space-y-4">
                {/* Title + Badge */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{sector.name}</h3>
                    <p className="text-sm text-gray-400">{sector.description}</p>
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
          );
        })}
      </div>

      {/* Expert Reviews Section */}
      <Card className="bg-[#0D0F1A] border border-gray-800/50 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Quote className="h-6 w-6 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Expert Insights & Analysis</h2>
          </div>
          
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
                  <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">View Source</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                  <span>{review.date}</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Expert Analysis</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 border border-cyan-600/30 rounded-lg bg-cyan-600/10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-cyan-400" />
              <div>
                <h4 className="font-semibold text-cyan-400 text-sm">DISCLAIMER</h4>
                <p className="text-sm text-gray-400">
                  Expert opinions are for informational purposes only and do not constitute investment advice. 
                  Always conduct your own research and consult with a qualified financial advisor before making investment decisions.
                  Clicking on expert reviews will redirect you to external sources.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}