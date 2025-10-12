import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Coins, 
  Globe, 
  Zap, 
  Brain, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import NewsFeed from "@/components/widgets/NewsFeed";

export default function LandingPage() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      title: "Interactive Heatmaps",
      description: "Visualize market movements with real-time heatmaps for stocks, crypto, and forex."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Insights",
      description: "Get intelligent analysis on company financials, risk assessment, and market sentiment."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Real-Time Data",
      description: "Access live market data with毫秒级 updates for informed decision-making."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Risk Assessment",
      description: "Comprehensive risk scoring and investment recommendations tailored to your portfolio."
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Professional Trader",
      content: "This platform transformed how I analyze markets. The AI insights are incredibly accurate.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Investment Analyst",
      content: "The heatmap visualization saves me hours of research every day. Highly recommended!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Portfolio Manager",
      content: "Best financial analysis tool I've used. The risk assessment feature is a game-changer.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$00",
      period: "/month",
      description: "Perfect for individual investors",
      features: [
        "Basic market heatmaps",
        "Limited AI insights",
        "Email support",
        "Up to 3 watchlists"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$00",
      period: "/month",
      description: "For active traders and analysts",
      features: [
        "Full market heatmaps",
        "Advanced AI analytics",
        "Priority support",
        "Unlimited watchlists",
        "Custom alerts"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For institutional investors",
      features: [
        "All Professional features",
        "Team collaboration",
        "API access",
        "Dedicated account manager",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
    {/* Left Text Section */}
  
    <div className="flex-1 text-center lg:text-left flex flex-col justify-center h-full">
      <Badge className="mb-4 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
        <Star className="h-3 w-3 mr-1" />
        AI-Powered Financial Analysis
      </Badge>

      {/* 🔹 Heading aligned with video */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-700 bg-clip-text text-transparent leading-tight">
        Transform Your Investment Decisions with AI
      </h1>

      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
        Professional financial analysis platform with real-time data, AI-powered insights, and comprehensive trading tools for smarter investing.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <Button
          size="lg"
          className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600"
          asChild
        >
          <Link to="/dashboard">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:bg-transparent" asChild>
          <Link to="/dashboard">View Demo</Link>
        </Button>
      </div>

      <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          No credit card required
        </div>
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          14-day free trial
        </div>
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          Cancel anytime
        </div>
      </div>
    </div>
    
    {/* Right Video Section */}
    <div className="flex-1 flex justify-center lg:justify-end items-center">
      <div className="relative w-full max-w-2xl">
        <video
          src="/src/components/widgets/landing page.webm"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-2xl shadow-2xl border border-border/50"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</section>
 <video
        src="src/components/widgets/tradingveiw.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto mt-2 rounded-lg"
      >
        Your browser does not support the video tag.
      </video>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-3xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Smart Investing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make informed financial decisions with confidence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Progress</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-center">We've been serving our users for over 10 years</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-5xl font-bold text-blue-500 mb-2">10K+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold text-purple-500 mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold text-green-500 mb-2">250+</div>
            <div className="text-muted-foreground">Markets Covered</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold text-yellow-500 mb-2">4.9/5</div>
            <div className="text-muted-foreground">User Rating</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-3xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Financial Professionals</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of investors who have transformed their approach to financial analysis
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-card/50 backdrop-blur border-border/50 ${
                plan.popular ? "ring-2 ring-blue-500 scale-105 z-10" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/dashboard">
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Investment Strategy?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of professionals who trust our platform for data-driven financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-700" asChild>
              <Link to="/dashboard">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/dashboard">Schedule a Demo</Link>
            </Button>
          </div>
        </div>
      </section>
        <video
        src="src/components/widgets/part3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto mt-2 rounded-lg"
      >
        Your browser does not support the video tag.
      </video>
      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Financial AI</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Advanced market intelligence platform for smarter investing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-foreground transition">Features</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Pricing</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">API</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-foreground transition">About</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Careers</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Terms</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Security</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Financial AI Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}