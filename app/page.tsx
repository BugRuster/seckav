'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Shield, Eye, CheckCircle, Zap, Brain, Database, Network, Lock, AlertTriangle, Terminal, Cpu, Activity, Layers, Server, GitBranch } from 'lucide-react';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchText, setGlitchText] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Glitch effect interval
    const glitchInterval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 200);
    }, 3000);

    // Matrix rain effect
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
      const matrixArray = matrix.split("");
      
      const fontSize = 10;
      const columns = canvas.width / fontSize;
      
      const drops: number[] = [];
      for(let x = 0; x < columns; x++) {
        drops[x] = 1;
      }
      
      const draw = () => {
        if (ctx) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#00ffff';
          ctx.font = fontSize + 'px monospace';
          
          for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        }
      };
      
      const matrixInterval = setInterval(draw, 35);
      
      return () => {
        clearInterval(matrixInterval);
      };
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Matrix Rain Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20" />

      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.1}px)`,
        }}
      />

      {/* Scanning Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"
          style={{
            top: `${(scrollY * 0.5) % (typeof window !== 'undefined' ? window.innerHeight : 1000)}px`,
            animation: 'scan 2s linear infinite',
          }}
        />
        <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50"
          style={{
            left: `${mousePosition.x}%`,
            animation: 'scanVertical 3s linear infinite',
          }}
        />
      </div>

      {/* Futuristic Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-black/95 backdrop-blur-xl' : 'bg-transparent'
      }`}>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 animate-pulse" />
                <Shield className="h-10 w-10 text-cyan-500 relative z-10" />
              </div>
              <span className="text-2xl font-mono font-bold text-cyan-500 tracking-wider">
                SECKAV
              </span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-12">
              {['SYSTEM', 'PROTOCOL', 'INTERFACE'].map((item, i) => (
                <a key={i} href={`#${item.toLowerCase()}`} className="relative group">
                  <span className="text-gray-500 font-mono text-sm tracking-widest hover:text-cyan-500 transition-colors duration-300">
                    {item}
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-px bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 text-xs font-mono bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 relative overflow-hidden group">
                <span className="relative z-10">INITIALIZING</span>
                <div className="absolute inset-0 bg-cyan-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Status Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-black border border-cyan-500/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent animate-pulse" />
              <Activity className="h-4 w-4 mr-3 text-cyan-500 animate-pulse" />
              <span className="text-cyan-500 font-mono text-sm tracking-wider">NEURAL.SECURITY.ACTIVE</span>
              <ArrowRight className="h-4 w-4 ml-3 text-cyan-500" />
            </div>
          </div>
          
          {/* Main Title with Glitch Effect */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-mono font-black mb-8 text-center leading-tight relative">
            <div className={`relative ${glitchText ? 'animate-glitch' : ''}`}>
              <span className="block text-white opacity-20">YOUR.API</span>
              <span className="block text-white opacity-40 -mt-4">YOUR.DATA</span>
              <span className="block text-cyan-500 -mt-4">OUR.SHIELD</span>
              {glitchText && (
                <>
                  <span className="absolute inset-0 block text-red-500 opacity-70" style={{ transform: 'translateX(2px)' }}>
                    <span className="block">YOUR.API</span>
                    <span className="block">YOUR.DATA</span>
                    <span className="block">OUR.SHIELD</span>
                  </span>
                  <span className="absolute inset-0 block text-blue-500 opacity-70" style={{ transform: 'translateX(-2px)' }}>
                    <span className="block">YOUR.API</span>
                    <span className="block">YOUR.DATA</span>
                    <span className="block">OUR.SHIELD</span>
                  </span>
                </>
              )}
            </div>
          </h1>
          
          <p className="max-w-4xl mx-auto text-lg text-gray-400 mb-12 text-center font-mono leading-relaxed">
            &gt; AUTONOMOUS_SECURITY_PROTOCOL // INDIAN_API_INFRASTRUCTURE<br/>
            &gt; REALTIME_THREAT_DETECTION // DPDP_COMPLIANCE_ENGINE<br/>
            &gt; STATUS: <span className="text-cyan-500">OPERATIONAL</span>
          </p>
          
          {/* Tech Stack */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
            {[
              { icon: Cpu, label: "NEURAL.AI" },
              { icon: Shield, label: "ZERO.CONFIG" },
              { icon: Zap, label: "QUANTUM.SPEED" },
              { icon: Database, label: "DPDP.SECURE" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 px-4 py-2 border border-gray-800 hover:border-cyan-500/50 transition-colors duration-300 group">
                <item.icon className="h-4 w-4 text-gray-500 group-hover:text-cyan-500 transition-colors duration-300" />
                <span className="text-xs font-mono text-gray-500 group-hover:text-cyan-500 transition-colors duration-300">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Terminal Display */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black border border-cyan-500/30 p-6 font-mono text-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <span className="text-gray-500">SECKAV://TERMINAL.v2.0</span>
              </div>
              <div className="space-y-2">
                <div className="text-gray-500">&gt; SYSTEM.INITIALIZE()</div>
                <div className="text-cyan-500">&gt; LOADING: NEURAL_SECURITY_ENGINE...</div>
                <div className="text-green-500">&gt; STATUS: DEVELOPMENT_MODE</div>
                <div className="text-yellow-500">&gt; WARNING: EARLY_ACCESS_ONLY</div>
                <div className="text-white">&gt; CONTACT: <span className="text-cyan-500">bugruster@gmail.com</span></div>
                <div className="text-gray-500 animate-pulse">█</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Threat Analysis */}
      <section id="system" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-mono font-black mb-4 text-cyan-500">
              THREAT.MATRIX
            </h2>
            <p className="text-gray-500 font-mono text-sm">
              &gt; ANALYZING_INDIAN_STARTUP_VULNERABILITIES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                code: "BREACH_001",
                title: "EXPOSED_ENDPOINTS",
                severity: 95,
                description: "NO_AUTH // NO_RATE_LIMIT // NO_ENCRYPTION"
              },
              {
                icon: Eye,
                code: "LEAK_002",
                title: "DATA_HEMORRHAGE",
                severity: 89,
                description: "PII_EXPOSED // AADHAR_LOGS // UNMONITORED"
              },
              {
                icon: AlertTriangle,
                code: "LEGAL_003",
                title: "DPDP_VIOLATION",
                severity: 92,
                description: "NON_COMPLIANT // PENALTY_RISK // SHUTDOWN"
              },
              {
                icon: Database,
                code: "COST_004",
                title: "PRICE_BARRIER",
                severity: 78,
                description: "US_TOOLS // OVERPRICED // INACCESSIBLE"
              },
              {
                icon: Activity,
                code: "SPEED_005",
                title: "DEV_FRICTION",
                severity: 85,
                description: "MANUAL_CONFIG // SLOW_DEPLOY // INNOVATION_BLOCKED"
              },
              {
                icon: Network,
                code: "BLIND_006",
                title: "ZERO_VISIBILITY",
                severity: 91,
                description: "NO_MONITORING // ATTACK_BLIND // POST_BREACH_ALERT"
              }
            ].map((threat, index) => (
              <div key={index} className="bg-black border border-gray-800 p-6 hover:border-red-500/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-50 animate-pulse" />
                
                <div className="flex items-center justify-between mb-4">
                  <threat.icon className="h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-xs font-mono text-red-500">{threat.code}</span>
                </div>
                
                <h3 className="text-sm font-mono text-white mb-2">{threat.title}</h3>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-gray-500">SEVERITY</span>
                    <span className="text-red-500">{threat.severity}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-900">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000"
                      style={{ width: `${threat.severity}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-xs font-mono text-gray-500">{threat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Modules */}
      <section id="protocol" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-mono font-black mb-4 text-cyan-500">
              DEFENSE.MODULES
            </h2>
            <p className="text-gray-500 font-mono text-sm">
              &gt; LOADING_AUTONOMOUS_SECURITY_PROTOCOLS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                module: "MOD_01",
                name: "API_SECURITY",
                status: "ACTIVE",
                features: ["AUTO_RATE_LIMIT", "TOKEN_EXPIRY", "ENCRYPTION_256"]
              },
              {
                icon: Brain,
                module: "MOD_02",
                name: "AI_SCANNER",
                status: "LEARNING",
                features: ["PII_DETECTION", "LEAK_ANALYSIS", "PATTERN_RECOGNITION"]
              },
              {
                icon: CheckCircle,
                module: "MOD_03",
                name: "DPDP_ENGINE",
                status: "COMPLIANT",
                features: ["AUTO_AUDIT", "LEGAL_REPORTS", "REALTIME_CHECK"]
              },
              {
                icon: Database,
                module: "MOD_04",
                name: "DATA_VAULT",
                status: "ENCRYPTED",
                features: ["QUANTUM_SAFE", "KEY_ROTATION", "ZERO_KNOWLEDGE"]
              },
              {
                icon: Activity,
                module: "MOD_05",
                name: "ALERT_SYSTEM",
                status: "MONITORING",
                features: ["ANOMALY_DETECT", "INSTANT_NOTIFY", "THREAT_PREDICT"]
              },
              {
                icon: Terminal,
                module: "MOD_06",
                name: "DEV_INTERFACE",
                status: "READY",
                features: ["NPM_INSTALL", "PIP_PACKAGE", "CARGO_CRATE"]
              }
            ].map((item, index) => (
              <div key={index} className="bg-black border border-gray-800 p-6 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-50 animate-pulse" />
                
                <div className="flex items-center justify-between mb-4">
                  <item.icon className="h-6 w-6 text-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-xs font-mono text-gray-500">{item.module}</span>
                </div>
                
                <h3 className="text-sm font-mono text-white mb-2">{item.name}</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-green-500">{item.status}</span>
                </div>
                
                <div className="space-y-1">
                  {item.features.map((feature, i) => (
                    <div key={i} className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors duration-300">
                      &gt; {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-mono font-black mb-4 text-cyan-500">
              EXECUTION.SEQUENCE
            </h2>
            <p className="text-gray-500 font-mono text-sm">
              &gt; FOUR_STEP_DEPLOYMENT_PROTOCOL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", name: "SCAN", desc: "DEEP_VULNERABILITY_ANALYSIS" },
              { step: "02", name: "ANALYZE", desc: "THREAT_VECTOR_IDENTIFICATION" },
              { step: "03", name: "DEPLOY", desc: "AUTO_SECURITY_ACTIVATION" },
              { step: "04", name: "MONITOR", desc: "REALTIME_THREAT_RESPONSE" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-2 border-cyan-500/30 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-mono font-bold text-cyan-500">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-lg font-mono font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs font-mono text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Terminal Demo */}
      <section id="interface" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-mono font-black mb-4 text-cyan-500">
              LIVE.INTERFACE
            </h2>
            <p className="text-gray-500 font-mono text-sm">
              &gt; NEURAL_SECURITY_DEMONSTRATION
            </p>
          </div>

          <div className="bg-black border border-cyan-500/30 p-8 font-mono text-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500" />
                    <div className="w-3 h-3 bg-yellow-500" />
                    <div className="w-3 h-3 bg-green-500" />
                  </div>
                  <span className="text-cyan-500 text-xs">SECKAV://NEURAL.TERMINAL</span>
                </div>
                <div className="text-green-500 text-xs animate-pulse">● LIVE</div>
              </div>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-green-500">$</span>
                  <span className="text-cyan-500 ml-2">npx seckav init --mode=neural</span>
                </div>
                <div className="text-gray-500 ml-4">🚀 INITIALIZING_NEURAL_ENGINE...</div>
                <div className="text-blue-500 ml-4">📡 SCANNING_API_ENDPOINTS...</div>
                <div className="text-yellow-500 ml-4">⚠️  VULNERABILITY_DETECTED: /api/v2/users [NO_AUTH]</div>
                <div className="text-red-500 ml-4">🔴 CRITICAL: AADHAR_IN_LOGS [DPDP_VIOLATION]</div>
                <div className="text-orange-500 ml-4">📊 THREAT_VECTORS: 47 [ANALYZING...]</div>
                <div className="text-cyan-500 ml-4">🛡️  DEPLOYING_QUANTUM_SHIELD...</div>
                <div className="text-green-500 ml-4">✅ SECURITY_ACTIVE [COMPLIANCE: 100%]</div>
                <div className="text-purple-500 ml-4">📈 MONITORING: REALTIME [LATENCY: 0.3ms]</div>
                <div className="text-white ml-4 mt-4">
                  <span className="animate-pulse">█</span>
                  <span className="text-gray-500 ml-2">READY_FOR_NEXT_COMMAND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-black border border-cyan-500/30 p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 animate-pulse" />
                  <Shield className="h-12 w-12 text-cyan-500 relative z-10" />
                </div>
              </div>
              
              <h2 className="text-4xl font-mono font-black text-white mb-6">
                INITIATE.CONTACT
              </h2>
              
              <p className="text-lg font-mono text-gray-400 mb-8">
                &gt; EARLY_ACCESS_PROTOCOL_ACTIVE<br/>
                &gt; PARTNERSHIP_CHANNELS_OPEN
              </p>
              
              <div className="bg-black/50 border border-cyan-500/30 p-6 mb-8">
                <p className="text-xs font-mono text-gray-500 mb-2">SECURE_CHANNEL</p>
                <a 
                  href="mailto:bugruster@gmail.com" 
                  className="text-2xl font-mono font-bold text-cyan-500 hover:text-cyan-400 transition-colors duration-300"
                >
                  bugruster@gmail.com
                </a>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Brain, label: "AI_RESEARCH", status: "OPEN" },
                  { icon: Zap, label: "BETA_ACCESS", status: "LIMITED" },
                  { icon: Server, label: "ENTERPRISE", status: "CUSTOM" }
                ].map((item, i) => (
                  <div key={i} className="border border-gray-800 p-4 hover:border-cyan-500/50 transition-colors duration-300 group">
                    <item.icon className="h-6 w-6 text-cyan-500 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="text-xs font-mono text-white">{item.label}</div>
                    <div className="text-xs font-mono text-gray-500">{item.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-mono text-gray-500">
            © 2025 SECKAV // NEURAL_SECURITY_SYSTEMS
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes scanVertical {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
      `}</style>
    </div>
  );
}