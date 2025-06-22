'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { 
  ArrowRight, 
  Shield, 
  Eye, 
  CheckCircle, 
  Zap, 
  Brain, 
  Database, 
  Network, 
  Lock, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  Activity, 
  Layers, 
  Server, 
  GitBranch, 
  Globe, 
  Users, 
  BarChart3, 
  Settings, 
  Play, 
  Star, 
  ChevronDown,
  Moon,
  Sun,
  Monitor,
  Menu,
  X,
  Code,
  Gauge,
  FileText,
  Bot,
  Scan,
  CreditCard,
  Building,
  Key,
  Webhook,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Updated features based on actual API capabilities
  const coreFeatures = [
    {
      icon: Shield,
      title: "Advanced API Firewall",
      description: "AI-powered firewall with custom rules, IP filtering, geo-blocking, and real-time threat detection. Block SQLi, XSS, and RCE attacks automatically.",
      color: "from-blue-500 to-blue-600",
      stats: "99.9% Attack Prevention"
    },
    {
      icon: Zap,
      title: "Intelligent Rate Limiting",
      description: "Adaptive rate limiting with custom policies, endpoint-specific limits, and AI-driven anomaly detection to prevent abuse and DDoS attacks.",
      color: "from-purple-500 to-purple-600",
      stats: "50K+ Requests/sec"
    },
    {
      icon: Lock,
      title: "Zero-Config Authentication",
      description: "JWT validation, OAuth integration, API key management with automatic rotation, and token lifecycle management.",
      color: "from-green-500 to-green-600",
      stats: "Enterprise Grade"
    },
    {
      icon: Network,
      title: "Encryption Gateway",
      description: "End-to-end encryption, TLS termination, certificate management, and quantum-safe encryption protocols for maximum security.",
      color: "from-orange-500 to-orange-600",
      stats: "256-bit Encryption"
    },
    {
      icon: Scan,
      title: "AI Security Scanner",
      description: "Advanced misconfiguration scanner with LLM integration. Detects CORS issues, exposed secrets, insecure headers, and API vulnerabilities.",
      color: "from-red-500 to-red-600",
      stats: "1000+ Scan Rules"
    },
    {
      icon: CheckCircle,
      title: "DPDP & CERT-IN Compliance",
      description: "Automated compliance reports, audit logs, GDPR readiness, and Indian data protection law compliance with real-time monitoring.",
      color: "from-teal-500 to-teal-600",
      stats: "100% Compliant"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive dashboard with threat analysis, geographic insights, API performance metrics, and predictive security analytics.",
      color: "from-indigo-500 to-indigo-600",
      stats: "Real-time Insights"
    },
    {
      icon: Bot,
      title: "AI Compliance Copilot",
      description: "Interactive AI assistant for security guidance, compliance checklists, threat analysis, and automated remediation suggestions.",
      color: "from-pink-500 to-pink-600",
      stats: "24/7 AI Support"
    }
  ];

  const sdkFeatures = [
    {
      title: "Node.js SDK",
      language: "JavaScript",
      description: "Express.js middleware, TypeScript support, async/await patterns",
      icon: Code,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Python SDK", 
      language: "Python",
      description: "Django/Flask integration, pip installable, asyncio support",
      icon: Terminal,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Go SDK",
      language: "Go",
      description: "Gin/Echo middleware, goroutine safe, minimal dependencies",
      icon: Cpu,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      title: "Java SDK",
      language: "Java",
      description: "Spring Boot integration, Maven/Gradle support, annotation-based",
      icon: Settings,
      color: "from-red-500 to-red-600"
    },
    {
      title: "PHP SDK",
      language: "PHP",
      description: "Laravel/Symfony integration, Composer package, PSR compliance",
      icon: Globe,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "REST API",
      language: "Universal",
      description: "Direct HTTP integration for any language or framework",
      icon: Network,
      color: "from-green-500 to-green-600"
    },
    {
      title: "CLI Tools",
      language: "Command Line",
      description: "Security scanning, configuration management, CI/CD integration",
      icon: Terminal,
      color: "from-gray-500 to-gray-600"
    },
    {
      title: "Webhooks",
      language: "Events",
      description: "Real-time security alerts, compliance notifications, custom integrations",
      icon: Webhook,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { label: "Security Modules", value: "8+", icon: Shield },
    { label: "SDK Languages", value: "5+", icon: Code },
    { label: "Security Rules", value: "1000+", icon: Database },
    { label: "Development Status", value: "Beta", icon: Activity }
  ];

  const pricingPlans = [
    {
      name: "Startup",
      price: "₹999",
      period: "/month",
      description: "Perfect for early-stage startups",
      features: [
        "Up to 10 API endpoints",
        "Basic firewall protection",
        "Rate limiting (1K req/min)",
        "DPDP compliance reports",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: "₹2,999", 
      period: "/month",
      description: "For growing startups and SMEs",
      features: [
        "Up to 100 API endpoints",
        "Advanced AI firewall",
        "Rate limiting (10K req/min)",
        "Real-time analytics",
        "AI Compliance Copilot",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited API endpoints",
        "Custom security rules",
        "Dedicated infrastructure",
        "Advanced analytics",
        "24/7 dedicated support",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border' 
          : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <Shield className="h-8 w-8 text-primary relative z-10" />
              </div>
              <span className="text-2xl font-bold">SecKav</span>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                API Security Platform
              </Badge>
            </div>
            
                         <div className="hidden lg:flex items-center space-x-8">
               {['Features', 'SDK', 'Pricing', 'Docs'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" className="hidden sm:inline-flex" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/auth/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-background border-t border-border">
                             <div className="px-2 pt-2 pb-3 space-y-1">
                 {['Features', 'SDK', 'Pricing', 'Docs'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="block px-3 py-2 text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Comprehensive API Security Platform
              <Badge className="ml-2 bg-blue-500/10 text-blue-600 border-blue-500/20">
                In Development
              </Badge>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Enterprise-Grade
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                API Security
              </span>
              <br />
              for Indian Startups
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed">
              Protect your APIs with AI-powered security, ensure DPDP compliance, and scale confidently. 
              Built specifically for Indian startups with enterprise features at startup-friendly prices.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/auth/register">
                  <Play className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 hover:bg-accent/10" asChild>
                <Link href="/auth/login">
                  <Eye className="mr-2 h-5 w-5" />
                  View Dashboard
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="destructive" className="mb-4">Critical Problem</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              The API Security Crisis in India
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              70% of Indian startups have unsecured APIs exposed to the internet, making them vulnerable to attacks and non-compliant with regulations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                {
                  icon: AlertTriangle,
                  title: "Exposed APIs with Hardcoded Keys",
                  description: "No authentication, rate limiting, or encryption - making startups easy targets.",
                  color: "destructive"
                },
                {
                  icon: Eye,
                  title: "Security Ignored Until Breach",
                  description: "Most startups only invest in security after an attack or during compliance audit.",
                  color: "warning"
                },
                {
                  icon: CreditCard,
                  title: "Expensive Enterprise Solutions",
                  description: "Cloudflare, AWS WAF cost $500-2000/month - unaffordable for Indian startups.",
                  color: "secondary"
                },
                {
                  icon: FileText,
                  title: "DPDP & CERT-IN Compliance Gap",
                  description: "New Indian data protection laws make API security mandatory, not optional.",
                  color: "primary"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:shadow-md transition-all">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.color === 'destructive' ? 'bg-red-100 dark:bg-red-900/20' :
                    item.color === 'warning' ? 'bg-orange-100 dark:bg-orange-900/20' :
                    item.color === 'secondary' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-primary/10'
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      item.color === 'destructive' ? 'text-red-600 dark:text-red-400' :
                      item.color === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                      item.color === 'secondary' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-primary'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-8 border border-red-200 dark:border-red-800">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                    <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">₹50 Cr+</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Average cost of a data breach for Indian companies
                  </p>
                  <Badge variant="destructive" className="text-base px-4 py-2">
                    Critical Risk
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Complete Solution</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              8 Powerful Security Modules
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Everything you need to secure your APIs, ensure compliance, and scale confidently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardHeader className="relative">
                  <div className={`inline-flex w-12 h-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {feature.stats}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
              </Card>
            ))}
          </div>
        </div>
      </section>

             {/* SDK Integration */}
       <section id="sdk-integration" className="py-20 bg-muted/30">
         <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="text-center mb-16">
             <Badge className="mb-4">Easy Integration</Badge>
             <h2 className="text-3xl lg:text-4xl font-bold mb-6">
               One SDK, Multiple Languages
             </h2>
             <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
               Integrate SecKav security into your existing applications with our comprehensive SDK.
             </p>
           </div>

                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {sdkFeatures.map((sdk, index) => (
               <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/60 backdrop-blur-sm border-border/50">
                 <CardHeader>
                   <div className="flex items-center justify-between mb-4">
                     <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r ${sdk.color} rounded-lg shadow-lg`}>
                       <sdk.icon className="h-5 w-5 text-white" />
                     </div>
                     <Badge variant="outline" className="text-xs">
                       {sdk.language}
                     </Badge>
                   </div>
                   <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                     {sdk.title}
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <CardDescription className="text-muted-foreground">
                     {sdk.description}
                   </CardDescription>
                 </CardContent>
               </Card>
             ))}
           </div>

           <div className="text-center mt-12">
             <Button size="lg" variant="outline" className="text-lg px-8 py-4">
               <Code className="mr-2 h-5 w-5" />
               View SDK Documentation
             </Button>
           </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Simple Pricing</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Choose Your Security Plan
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Start free, scale as you grow. Enterprise security at startup-friendly prices.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-2xl scale-105' : 'border-border'} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

             {/* Development Status */}
       <section className="py-20 bg-muted/30">
         <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="text-center mb-16">
             <Badge className="mb-4">Development Status</Badge>
             <h2 className="text-3xl lg:text-4xl font-bold mb-6">
               Built for Indian Startups
             </h2>
             <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
               We're building the most comprehensive API security platform specifically for the Indian market.
             </p>
           </div>

           <div className="grid lg:grid-cols-3 gap-8">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm">
                 <CardContent className="p-6 text-center">
                   <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                     <Code className="h-8 w-8 text-primary" />
                   </div>
                   <h3 className="text-xl font-bold mb-4">Multi-Language SDK</h3>
                   <p className="text-muted-foreground">
                     Node.js, Python, Go, Java, PHP SDKs with framework-specific integrations and examples.
                   </p>
                 </CardContent>
               </Card>

             <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm">
               <CardContent className="p-6 text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                   <Shield className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-4">8 Security Modules</h3>
                 <p className="text-muted-foreground">
                   Advanced firewall, rate limiting, encryption, AI scanner, and compliance tools.
                 </p>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm">
               <CardContent className="p-6 text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                   <CheckCircle className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold mb-4">DPDP Compliant</h3>
                 <p className="text-muted-foreground">
                   Built with Indian data protection laws and CERT-IN guidelines in mind.
                 </p>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center px-4 lg:px-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Secure Your APIs?
          </h2>
                     <p className="text-xl text-muted-foreground mb-8">
             Get early access to the most comprehensive API security platform built for Indian startups.
           </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button size="lg" className="text-lg px-8 py-4 shadow-xl">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
              Schedule Demo Call
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">SecKav</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Enterprise-grade API security platform built for Indian startups. 
                DPDP compliant, CERT-IN ready, with AI-powered protection.
              </p>
                             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                 <Badge variant="outline">
                   <CheckCircle className="h-3 w-3 mr-1" />
                   DPDP Compliant Design
                 </Badge>
                 <Badge variant="outline">
                   <Code className="h-3 w-3 mr-1" />
                   Open Source Ready
                 </Badge>
               </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">DPDP Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col lg:flex-row items-center justify-between">
            <p className="text-muted-foreground text-center lg:text-left">
              © 2024 SecKav Technologies Pvt Ltd. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Badge variant="outline" className="text-xs">
                Made in India 🇮🇳 for Bharat
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}