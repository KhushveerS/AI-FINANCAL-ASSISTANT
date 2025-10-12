import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdvancedChart from "@/components/widgets/AdvancedChart";
import Navbar from "@/components/dashboard/Navbar";

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Advanced Charting</h1>
          <p className="text-muted-foreground">Professional trading charts with technical indicators and analysis tools</p>
        </div>
        <Card className="bg-gradient-surface border-border/50 shadow-card">
          <CardHeader>
            <CardTitle>Advanced Charting Tools</CardTitle>
          </CardHeader>
          <CardContent className="h-[600px] p-0">
            <AdvancedChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}