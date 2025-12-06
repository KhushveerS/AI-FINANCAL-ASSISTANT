import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/dashboard/Navbar";
import { 
  Brain, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Loader2,
  BarChart3,
  PieChart,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInvestmentStrategy, type InvestmentStrategy, type InvestmentStrategyRequest } from "@/lib/investmentStrategyService";

export default function InvestmentAssistant() {
  const [amount, setAmount] = useState("");
  const [timeMonths, setTimeMonths] = useState("");
  const [desiredInterest, setDesiredInterest] = useState("");
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<InvestmentStrategy | null>(null);
  const { toast } = useToast();

  const handleGenerateStrategy = async () => {
    // Validation
    const amountNum = parseFloat(amount);
    const timeNum = parseFloat(timeMonths);
    const interestNum = parseFloat(desiredInterest);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (!timeMonths || isNaN(timeNum) || timeNum <= 0) {
      toast({
        title: "Invalid Time Period",
        description: "Please enter a valid time period in months.",
        variant: "destructive",
      });
      return;
    }

    if (!desiredInterest || isNaN(interestNum) || interestNum <= 0 || interestNum > 50) {
      toast({
        title: "Invalid Interest Rate",
        description: "Please enter a valid interest rate between 0% and 50%.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setStrategy(null);

    try {
      const request: InvestmentStrategyRequest = {
        amount: amountNum,
        timeMonths: timeNum,
        desiredInterest: interestNum,
        riskTolerance,
      };

      toast({
        title: "Generating Strategy",
        description: "AI is analyzing your requirements and creating a personalized investment strategy...",
      });

      const result = await generateInvestmentStrategy(request);
      setStrategy(result);

      toast({
        title: "Strategy Generated",
        description: "Your personalized investment strategy is ready!",
      });
    } catch (error: any) {
      console.error("Error generating strategy:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate investment strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReturnColor = (returnRate: number) => {
    if (returnRate >= 10) return 'text-green-600';
    if (returnRate >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
              AI Investment Assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            Get personalized investment strategies based on your amount, time horizon, and desired returns
          </p>
        </div>

        {/* Input Form */}
        <Card className="mb-6 bg-gradient-to-br from-black to-gray-800 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
               Investment Parameters
               
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 " />
                  Investment Amount (USD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Time Period (Months)
                </Label>
                <Input
                  id="time"
                  type="number"
                  placeholder="e.g., 12"
                  value={timeMonths}
                  onChange={(e) => setTimeMonths(e.target.value)}
                  className="bg-white"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Desired Interest (%)
                </Label>
                <Input
                  id="interest"
                  type="number"
                  placeholder="e.g., 10"
                  value={desiredInterest}
                  onChange={(e) => setDesiredInterest(e.target.value)}
                  className="bg-white"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Tolerance
                </Label>
                <Select value={riskTolerance} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskTolerance(value)} disabled={loading}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerateStrategy}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Investment Strategy
                </>
              )}
            </Button>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <Info className="h-3 w-3 inline mr-1" />
                <strong>Real-time Analysis:</strong> This strategy uses current market data and AI analysis to provide recommendations based on today's market conditions. For best results, configure your Gemini API key in the .env file.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Results */}
        {strategy && (
          <div className="space-y-6 animate-slide-up">
            {/* Summary Card */}
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Strategy Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{strategy.summary}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-blue-800">${strategy.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Target Return</p>
                    <p className="text-lg font-bold text-green-800">{strategy.targetReturn}%</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">Expected Return</p>
                    <p className={`text-lg font-bold ${getReturnColor(strategy.expectedReturn)}`}>
                      {strategy.expectedReturn.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600 mb-1">Projected Value</p>
                    <p className="text-lg font-bold text-orange-800">
                      ${strategy.projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge className={getRiskColor(strategy.riskLevel)}>
                    Risk: {strategy.riskLevel.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    Time: {strategy.timeHorizon}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Sector Allocation */}
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Sector Allocation Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategy.sectors.map((sector, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{sector.sector}</h4>
                            <Badge className={getRiskColor(sector.riskLevel)}>
                              {sector.riskLevel}
                            </Badge>
                            <Badge variant="outline">
                              {sector.allocation}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{sector.reasoning}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">
                              Expected Return: <span className={`font-semibold ${getReturnColor(sector.expectedReturn)}`}>
                                {sector.expectedReturn.toFixed(1)}%
                              </span>
                            </span>
                            <span className="text-gray-600">
                              Allocation: <span className="font-semibold">${(strategy.totalAmount * sector.allocation / 100).toLocaleString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <Progress value={sector.allocation} className="h-2 mb-3" />

                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Specific Recommendations:</p>
                        <div className="flex flex-wrap gap-2">
                          {sector.specificRecommendations.map((rec, recIndex) => (
                            <Badge key={recIndex} variant="secondary" className="text-xs">
                              {rec}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Time Horizon: {sector.timeHorizon}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Diversification & Considerations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-green-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Diversification Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{strategy.diversification}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Key Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strategy.keyConsiderations.map((consideration, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Warnings */}
            <Card className="bg-white border-red-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Important Warnings & Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strategy.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Placeholder when no strategy */}
        {!strategy && !loading && (
          <Card className="bg-gradient-surface border-border/50 shadow-card">
            <CardContent className="p-12 text-center">
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Generate Your Strategy</h3>
              <p className="text-muted-foreground">
                Enter your investment parameters above and let AI create a personalized investment strategy for you
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

