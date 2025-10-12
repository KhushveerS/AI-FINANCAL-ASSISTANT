import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

const marketData = [
  { name: "S&P 500", value: "4,567.89", change: "+1.23%", trend: "up" },
  { name: "NASDAQ", value: "14,123.45", change: "-0.45%", trend: "down" },
  { name: "DOW JONES", value: "34,789.12", change: "+0.78%", trend: "up" },
  { name: "RUSSELL 2000", value: "2,123.45", change: "+2.11%", trend: "up" },
];

const sectors = [
  { name: "Technology", change: "+2.1%", trend: "up" },
  { name: "Healthcare", change: "+1.5%", trend: "up" },
  { name: "Energy", change: "-0.8%", trend: "down" },
  { name: "Financials", change: "+0.9%", trend: "up" },
  { name: "Consumer", change: "-0.3%", trend: "down" },
  { name: "Industrials", change: "+1.2%", trend: "up" },
];
 
export default function MarketOverview() {

  return (
    <div className="w-full space-y-6">
     
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketData.map((market) => (
          <Card key={market.name} className="w-full bg-gradient-surface border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{market.name}</p>
                  <p className="text-xl font-bold">{market.value}</p>
                </div>
                <div className="text-right">
                  <Badge className={market.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                    {market.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {market.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
     
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full bg-gradient-surface border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Sector Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sectors.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span className="font-medium">{sector.name}</span>
                  <Badge className={sector.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                    {sector.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {sector.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full bg-gradient-surface border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Market Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full space-y-4">
              <div className="w-full p-4 bg-success/10 border border-success/20 rounded-lg">
                <h4 className="font-semibold text-success mb-1">Strong Tech Rally</h4>
                <p className="text-sm text-muted-foreground">Technology stocks leading the market with AI-driven gains</p>
              </div>
              <div className="w-full p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-semibold text-warning mb-1">Fed Watch</h4>
                <p className="text-sm text-muted-foreground">Markets await Federal Reserve policy announcement</p>
              </div>
              <div className="w-full p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-1">Earnings Season</h4>
                <p className="text-sm text-muted-foreground">Q4 earnings reports showing mixed results</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    
  );
}