import { Link, useLocation } from "react-router-dom";
import { 
  Activity, 
  BarChart3, 
  Globe, 
  Coins, 
  TrendingUp, 
  PieChart, 
  LineChart,
  Home,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: Home },
    { name: "Stocks", path: "/dashboard/stocks", icon: BarChart3 },
    { name: "Crypto", path: "/dashboard/crypto", icon: Coins },
    { name: "Forex", path: "/dashboard/forex", icon: Globe },
    { name: "ETF", path: "/dashboard/etf", icon: PieChart },
    { name: "Charts", path: "/dashboard/charts", icon: LineChart },
    { name: "AI Analysis", path: "/dashboard/analysis", icon: TrendingUp },
    { name: "News", path: "/dashboard/news", icon: Newspaper },
    { name:"Bond",path:"/dashboard/bond",icon: Activity   },
    { name: "Sentimental", path: "/dashboard/Sentimental", icon: LineChart }
  ];

  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-trading rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Financial AI Assistant</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  asChild
                  className="gap-2"
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse-glow"></div>
            <span className="text-sm text-muted-foreground">Live Data</span>
          </div>
        </div>
      </div>
    </nav>
  );
}