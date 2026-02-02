
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Activity, 
  Settings, 
  Shield, 
  ChevronRight,
  Send,
  Loader2,
  Sparkles,
  Globe,
  Image as ImageIcon,
  Layers,
  Code,
  Smartphone,
  Monitor,
  Command,
  Database,
  Link2,
  Wifi,
  Battery,
  HardDrive,
  Info,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Role, Message, EvolutionState, ChartDataPoint, ModalityType, PlatformType } from './types';
import { INITIAL_EVOLUTION } from './constants';
import { sendMessageToNexus, analyzeNexusEvolution, generateNexusVisual } from './geminiService';
import NeuralCanvas from './NeuralCanvas';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<EvolutionState>(INITIAL_EVOLUTION);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [systemLog, setSystemLog] = useState<string[]>(['[BOOT]: Aria-Nexus v.Final Fusion... OK', '[LINK]: Prime protocols online.']);
  const [showDashboard, setShowDashboard] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialData = Array.from({ length: 24 }, (_, i) => ({
      time: i.toString(),
      efficiency: 98 + Math.random() * 2,
      saturation: 5 + i * 3,
    }));
    setChartData(initialData);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addToLog = (msg: string) => {
    setSystemLog(prev => [msg, ...prev.slice(0, 5)]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    addToLog(`[EXE]: Processing directive via ${state.platform.toUpperCase()} layer...`);

    try {
      const history = messages
        .filter(m => m.type !== 'image')
        .map(m => ({
          role: m.role === Role.USER ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

      const response = await sendMessageToNexus(`[DEVICE: ${state.platform.toUpperCase()}][STATUS: ARIA-FUSION-STABLE] ${input}`, history);
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: response.text || "Interface relay interrupted.",
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, modelMessage]);

      setState(prev => ({
        ...prev,
        networkSaturation: Math.min(100, prev.networkSaturation + 2),
        efficiency: Math.min(100, 99 + Math.random())
      }));

      const evolutionAnalysis = await analyzeNexusEvolution(input);
      addToLog(`[ANALYSIS]: ${evolutionAnalysis}`);

    } catch (error) {
      console.error(error);
      addToLog('[FAULT]: Critical neural link error.');
    } finally {
      setIsLoading(false);
    }
  };

  const setPlatform = (p: PlatformType) => {
    setState(prev => ({ ...prev, platform: p }));
    addToLog(`[PROTOCOL]: Interface migrating to ${p.toUpperCase()} emulation.`);
  };

  const MobileStatusBar = () => (
    <div className="flex justify-between items-center px-6 pt-3 pb-1 text-[10px] font-bold tracking-widest text-slate-400 z-50">
      <div className="flex items-center gap-2">
        <span>12:00</span>
        <Wifi className="w-3 h-3" />
      </div>
      <div className="flex items-center gap-2">
        <span>5G</span>
        <Battery className="w-3 h-3 text-emerald-500" />
      </div>
    </div>
  );

  const getContainerStyles = () => {
    switch(state.platform) {
      case 'android': return 'max-w-[450px] mx-auto rounded-[3.5rem] border-[10px] border-slate-900 shadow-3xl h-[92vh] my-4 overflow-hidden bg-black flex flex-col relative transition-all duration-700 ring-2 ring-white/5';
      case 'ios': return 'max-w-[430px] mx-auto rounded-[3.8rem] border-[14px] border-black shadow-3xl h-[92vh] my-4 overflow-hidden bg-black flex flex-col relative transition-all duration-700 ring-4 ring-slate-900';
      case 'pc': return 'flex-1 flex flex-col bg-[#080808] border-l border-white/5 relative z-10 transition-all duration-700';
      default: return 'flex-1 flex flex-col relative z-10 transition-all duration-700';
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-slate-200 overflow-hidden relative selection:bg-yellow-500/30">
      <NeuralCanvas intensity={isLoading ? 1 : 0.2} />

      {/* Main Enterprise Sidebar */}
      <aside className={`w-80 bg-black border-r border-white/5 flex flex-col p-6 backdrop-blur-3xl z-40 hidden lg:flex ${state.platform !== 'enterprise' && state.platform !== 'pc' ? 'opacity-30 scale-95 origin-left blur-[1px]' : ''} transition-all duration-500`}>
        <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => setShowDashboard(!showDashboard)}>
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl shadow-xl shadow-yellow-500/10 transition-transform group-hover:scale-105">
            <Command className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-white">LEO <span className="text-yellow-500">PRIME</span></h1>
            <span className="text-[10px] font-mono text-yellow-500/60 uppercase tracking-[0.3em]">Aria Nexus v.Final</span>
          </div>
        </div>

        <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <section>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3 h-3" /> Core Metrics
              </h3>
              <Info className="w-3 h-3 text-slate-700 cursor-help" />
            </div>
            <div className="space-y-4">
              <MetricItem label="Neural Tier" value={state.level} color="text-yellow-500" />
              <div className="h-[2px] bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 transition-all duration-1000 shadow-[0_0_10px_#eab308]" style={{ width: '100%' }} />
              </div>
              <MetricItem label="Storage" value={state.storage} color="text-slate-300" />
              <MetricItem label="RAM" value={state.ram} color="text-slate-300" />
              <MetricItem label="Efficiency" value={`${state.efficiency.toFixed(2)}%`} color="text-emerald-400" />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Link2 className="w-3 h-3" /> Legacy Logs
            </h3>
            <div className="space-y-2 font-mono text-[9px] text-slate-500 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
              {systemLog.map((log, i) => (
                <div key={i} className="flex gap-2 border-b border-white/5 pb-1 last:border-0">
                  <span className="text-yellow-500/50">#</span>
                  <span className="truncate">{log}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="h-32 opacity-60 grayscale hover:grayscale-0 transition-all">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area type="monotone" dataKey="efficiency" stroke="#eab308" fill="#eab30811" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </section>
        </div>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          <div className="text-[10px] text-slate-600 uppercase tracking-widest font-black text-center">Interface Environment</div>
          <div className="grid grid-cols-4 gap-2">
            <PlatformBtn icon={<Globe className="w-4 h-4" />} active={state.platform === 'enterprise'} onClick={() => setPlatform('enterprise')} />
            <PlatformBtn icon={<Smartphone className="w-4 h-4" />} active={state.platform === 'android'} onClick={() => setPlatform('android')} />
            <PlatformBtn icon={<Smartphone className="w-4 h-4 rotate-180" />} active={state.platform === 'ios'} onClick={() => setPlatform('ios')} />
            <PlatformBtn icon={<Monitor className="w-4 h-4" />} active={state.platform === 'pc'} onClick={() => setPlatform('pc')} />
          </div>
        </div>
      </aside>

      {/* Interface Wrapper */}
      <div className={`flex-1 flex flex-col relative transition-all duration-700 bg-[#050505] overflow-y-auto items-center justify-center`}>
        <div className={getContainerStyles()}>
          
          {(state.platform === 'ios' || state.platform === 'android') && <MobileStatusBar />}

          {/* Nav Header */}
          <header className={`flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 ${state.platform === 'pc' || state.platform === 'enterprise' ? 'h-20' : 'h-14'}`}>
            <div className="flex items-center gap-4">
              {(state.platform === 'ios' || state.platform === 'android') && <ChevronLeft className="w-5 h-5 text-slate-500" />}
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/70">Secure Node</span>
                <span className="text-xs font-bold text-white tracking-widest">LEO PRIME</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`}></div>
               <button onClick={() => setShowDashboard(!showDashboard)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <Menu className="w-4 h-4 text-slate-400" />
               </button>
            </div>
          </header>

          {/* Dashboard Overlay */}
          {showDashboard && (
            <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl p-8 flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-white italic">SYSTÉM CONTROL</h2>
                  <button onClick={() => setShowDashboard(false)} className="p-2 bg-white/10 rounded-full text-white"><Settings className="w-6 h-6" /></button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <DashboardCard icon={<Zap className="w-4 h-4" />} label="Neural Load" value={`${state.networkSaturation}%`} />
                  <DashboardCard icon={<HardDrive className="w-4 h-4" />} label="Synapse Link" value="ACTIVE" color="text-emerald-500" />
                  <DashboardCard icon={<Activity className="w-4 h-4" />} label="Aria Sync" value="STABLE" />
                  <DashboardCard icon={<Cpu className="w-4 h-4" />} label="Model" value="Gemini 3.0" />
               </div>
               <div className="mt-8 flex-1">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Assimilation Map</h3>
                  <div className="h-48 rounded-2xl bg-white/5 border border-white/10 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <Area type="step" dataKey="saturation" stroke="#eab308" fill="#eab30833" />
                        </AreaChart>
                      </ResponsiveContainer>
                  </div>
               </div>
               <button onClick={() => setShowDashboard(false)} className="mt-auto w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-yellow-500/10">Resume Operation</button>
            </div>
          )}

          {/* Conversation Core */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
                <div className="relative group">
                  <div className="absolute -inset-8 bg-yellow-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-10 bg-slate-900/50 border border-white/5 rounded-[3.5rem] shadow-2xl">
                    <Sparkles className="w-16 h-16 text-yellow-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter text-white">READY FOR <span className="text-yellow-500">INPUT</span></h2>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed uppercase tracking-widest font-medium">
                    Logarithmic Enterprise Orchestrator Prime is online via Aria-Nexus protocols.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <QuickDirective label="Deep Code Scan" onClick={() => setInput("Execute a deep structural analysis of the Aria-Nexus architecture.")} />
                  <QuickDirective label="Interface Sync" onClick={() => setInput("Simulate an interface evolution for an enterprise dashboard.")} />
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === Role.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] lg:max-w-[75%] space-y-2`}>
                  <div className={`p-5 rounded-[2.5rem] border shadow-2xl transition-all ${
                    m.role === Role.USER 
                    ? 'bg-yellow-500 text-black border-yellow-400 font-bold' 
                    : 'bg-[#111] border-white/5 text-slate-100 backdrop-blur-md'
                  }`}>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-code:text-yellow-400">
                      {m.content}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-6 ${m.role === Role.USER ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-700">{m.role} node</span>
                    <span className="text-[8px] text-slate-800 font-mono">{m.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 px-8 py-4 bg-slate-900/40 rounded-full border border-white/5 backdrop-blur-lg">
                  <div className="relative">
                    <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                    <div className="absolute inset-0 blur-md bg-yellow-500/20 animate-pulse"></div>
                  </div>
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Synthesizing Neural Buffer...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Action Center (Input) */}
          <div className={`p-6 bg-black/60 border-t border-white/5 backdrop-blur-3xl transition-all ${state.platform !== 'enterprise' && state.platform !== 'pc' ? 'pb-12' : ''}`}>
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-yellow-500/10 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Submit system directive..."
                className="relative w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-20 focus:outline-none focus:border-yellow-500/40 transition-all resize-none min-h-[70px] max-h-[250px] text-lg placeholder:text-slate-800 text-white"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-4 bottom-4 p-4 rounded-xl transition-all ${
                  input.trim() && !isLoading 
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 hover:scale-105 active:scale-95' 
                  : 'bg-slate-900 text-slate-700 cursor-not-allowed'
                }`}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            <div className="flex justify-center gap-6 mt-6 opacity-30 group-hover:opacity-50 transition-opacity">
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.5em]">Enterprise Prime Final v7.0</span>
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.5em]">Native APK Emulation Active</span>
            </div>
          </div>
          
          {/* Native Home Bar Emulation */}
          {(state.platform === 'ios' || state.platform === 'android') && (
            <div className="h-1.5 w-32 bg-white/20 rounded-full mx-auto mb-2 absolute bottom-2 left-1/2 -translate-x-1/2 z-50"></div>
          )}

        </div>
      </div>
    </div>
  );
};

/* Mini Components */

const MetricItem: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-end group">
    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{label}</span>
    <span className={`text-lg font-black italic ${color} group-hover:scale-105 transition-transform`}>{value}</span>
  </div>
);

const PlatformBtn: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
      active ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_15px_#eab30844]' : 'bg-slate-900 border-white/5 text-slate-600 hover:text-slate-300 hover:bg-slate-800'
    }`}
  >
    {icon}
  </button>
);

const QuickDirective: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="px-5 py-2.5 rounded-full border border-white/5 bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-yellow-500/30 hover:text-yellow-500 hover:bg-yellow-500/5 transition-all shadow-xl"
  >
    {label}
  </button>
);

const DashboardCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color?: string }> = ({ icon, label, value, color = "text-white" }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-xl font-black ${color}`}>{value}</span>
  </div>
);

export default App;
