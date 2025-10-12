import StockAnalyzer from "@/components/analysis/StockAnalyzer";
import Navbar from "@/components/dashboard/Navbar";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI-Powered Analysis</h1>
          <p className="text-muted-foreground">Advanced financial analysis powered by artificial intelligence</p>
        </div>
        <StockAnalyzer />
      </div>
    </div>
  );
}