import React from 'react'
import { Bus, UserCheck, Shield, Sparkles, RefreshCw, Smartphone } from 'lucide-react'

export type ActiveTab = 'landing' | 'passenger' | 'driver' | 'admin'

interface NavbarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  onResetDemo: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onResetDemo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            src="/assets/logo.png" 
            alt="Cupora Logo" 
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
            Minivanes Perú
          </span>
        </div>

        {/* Central Nav Tabs / Role Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800/80 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-medium transition-all duration-150 ${
              activeTab === 'landing'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passenger')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-medium transition-all duration-150 ${
              activeTab === 'passenger'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pasajero</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('driver')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-medium transition-all duration-150 ${
              activeTab === 'driver'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Chofer PWA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-medium transition-all duration-150 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Despacho</span>
          </button>
        </nav>

        {/* Right tools: Realtime Badge & Reset Demo */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Sync Tiempo Real</span>
          </div>

          <button
            type="button"
            onClick={onResetDemo}
            title="Reiniciar datos de demostración"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Reiniciar Demo</span>
          </button>
        </div>
      </div>
    </header>
  )
}
