import React from 'react'
import { Bus, Smartphone, Shield, Sparkles, RefreshCw, LogIn, LogOut, UserCheck, ChevronDown } from 'lucide-react'
import { UserAccount, UserRole } from '../types'

export type ActiveTab = 'landing' | 'passenger' | 'driver' | 'admin'

interface NavbarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  onResetDemo: () => void
  currentUser: UserAccount | null
  onOpenLogin: () => void
  onLogout: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  currentUser,
  onOpenLogin,
  onLogout
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'driver':
        return { label: 'Chofer', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' }
      case 'admin':
        return { label: 'Admin', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' }
      case 'passenger':
      default:
        return { label: 'Pasajero', color: 'bg-teal-950 text-teal-300 border-teal-800' }
    }
  }

  const roleInfo = currentUser ? getRoleBadge(currentUser.role) : null

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <img 
              src="/assets/logo.png" 
              alt="Cupora Logo" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Minivanes Perú
            </span>
          </div>

          {/* Desktop Central Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800/80 text-xs shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl font-medium transition-all duration-150 ${
                activeTab === 'landing'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('passenger')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl font-medium transition-all duration-150 ${
                activeTab === 'passenger'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pasajero PWA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('driver')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl font-medium transition-all duration-150 ${
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
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl font-medium transition-all duration-150 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Despacho</span>
            </button>
          </nav>

          {/* Right Tools: Auth Status, Profile & Reset */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 pl-2.5 rounded-2xl text-xs">
                <div 
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                  title="Cambiar perfil / Iniciar sesión"
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo?.color}`}>
                    {roleInfo?.label}
                  </span>
                  <span className="text-white font-medium truncate max-w-[90px] sm:max-w-[130px]">
                    {currentUser.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="py-1.5 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-600/30"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingresar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onResetDemo}
              title="Reiniciar datos de prueba"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Native App Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/90 border-t border-slate-800/90 backdrop-blur-2xl px-3 py-2 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
              activeTab === 'landing'
                ? 'text-teal-300 font-bold bg-teal-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className={`w-5 h-5 mb-0.5 ${activeTab === 'landing' ? 'text-teal-400' : ''}`} />
            <span className="text-[10px]">Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passenger')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
              activeTab === 'passenger'
                ? 'text-teal-300 font-bold bg-teal-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className={`w-5 h-5 mb-0.5 ${activeTab === 'passenger' ? 'text-teal-400' : ''}`} />
            <span className="text-[10px]">Pasajero</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('driver')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
              activeTab === 'driver'
                ? 'text-teal-300 font-bold bg-teal-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className={`w-5 h-5 mb-0.5 ${activeTab === 'driver' ? 'text-teal-400' : ''}`} />
            <span className="text-[10px]">Chofer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
              activeTab === 'admin'
                ? 'text-teal-300 font-bold bg-teal-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className={`w-5 h-5 mb-0.5 ${activeTab === 'admin' ? 'text-teal-400' : ''}`} />
            <span className="text-[10px]">Despacho</span>
          </button>
        </div>
      </div>
    </>
  )
}
