import React, { useState, useEffect } from 'react'
import { Navbar, ActiveTab } from './components/Navbar'
import { LandingView } from './views/LandingView'
import { PassengerView } from './views/PassengerView'
import { DriverView } from './views/DriverView'
import { AdminView } from './views/AdminView'
import { LoginModal } from './components/LoginModal'
import { 
  getSavedTrips, 
  getSavedModels, 
  getSavedTickets, 
  getCurrentUser,
  setCurrentUser,
  subscribeToSync, 
  resetDemoData 
} from './services/storageService'
import { Trip, MinivanModel, TicketData, UserAccount } from './types'
import { Shield, Sparkles, MapPin, Zap, Smartphone, Check, ArrowDownToLine } from 'lucide-react'

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing')
  const [currentUser, setAuthUser] = useState<UserAccount | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)

  const [trips, setTrips] = useState<Trip[]>([])
  const [models, setModels] = useState<MinivanModel[]>([])
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [syncToast, setSyncToast] = useState<string | null>(null)
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true)

  // Load initial data
  const loadAllData = () => {
    setTrips(getSavedTrips())
    setModels(getSavedModels())
    setTickets(getSavedTickets())
    setAuthUser(getCurrentUser())
  }

  useEffect(() => {
    loadAllData()

    const unsubscribe = subscribeToSync((type, payload) => {
      loadAllData()
      if (type === 'TRIPS_UPDATED') {
        setSyncToast('⚡ Sincronización en vivo: Los asientos y aforo se actualizaron.')
        setTimeout(() => setSyncToast(null), 3500)
      } else if (type === 'MODELS_UPDATED') {
        setSyncToast('🚐 Se actualizó la distribución de asientos de la minivan.')
        setTimeout(() => setSyncToast(null), 3500)
      } else if (type === 'AUTH_CHANGED') {
        setAuthUser(payload)
      } else if (type === 'DEMO_RESET') {
        setSyncToast('🔄 Datos de demostración restaurados.')
        setTimeout(() => setSyncToast(null), 3500)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleResetDemo = () => {
    if (window.confirm('¿Deseas reiniciar los asientos y viajes a los valores predeterminados de prueba?')) {
      resetDemoData()
      loadAllData()
    }
  }

  const handleLoginSuccess = (user: UserAccount) => {
    setAuthUser(user)
    setSyncToast(`👋 Sesión iniciada: ${user.name} (${user.role.toUpperCase()})`)
    setTimeout(() => setSyncToast(null), 3500)

    // Route user directly to their respective interface
    if (user.role === 'driver') {
      setActiveTab('driver')
    } else if (user.role === 'admin') {
      setActiveTab('admin')
    } else {
      setActiveTab('passenger')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setAuthUser(null)
    setSyncToast('🔒 Has cerrado sesión.')
    setTimeout(() => setSyncToast(null), 3000)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white antialiased">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating Sync Notification Toast */}
      {syncToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 border border-teal-500/60 text-teal-300 text-xs px-4 py-3 rounded-2xl shadow-2xl shadow-teal-500/20 flex items-center gap-2 animate-in slide-in-from-bottom-5 backdrop-blur-xl">
          <Zap className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Mobile PWA Install / Ready Banner */}
      {showPwaBanner && (
        <div className="bg-gradient-to-r from-teal-950/80 via-slate-950 to-emerald-950/80 border-b border-teal-500/20 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                <Smartphone className="w-3.5 h-3.5" />
              </span>
              <span>
                <strong>PWA Móvil Cupora:</strong> Inicia sesión como Pasajero, Chofer o Administrador con roles sincronizados.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPwaBanner(false)}
              className="text-slate-500 hover:text-slate-300 text-xs shrink-0 px-2 py-0.5 rounded-lg hover:bg-slate-800"
            >
              ✕ Ocultar
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-28 md:pb-14">
        {activeTab === 'landing' && <LandingView onNavigate={setActiveTab} />}
        {activeTab === 'passenger' && (
          <PassengerView
            trips={trips}
            models={models}
            onUpdateTrips={setTrips}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}
        {activeTab === 'driver' && (
          <DriverView
            trips={trips}
            models={models}
            tickets={tickets}
            onUpdateTrips={setTrips}
            onUpdateModels={setModels}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}
        {activeTab === 'admin' && (
          <AdminView
            models={models}
            trips={trips}
            tickets={tickets}
            onUpdateModels={setModels}
            onUpdateTrips={setTrips}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-10 text-xs text-slate-400 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/icon.png" alt="Cupora Icon" className="w-7 h-7 object-contain" />
            <div>
              <span className="text-white font-bold text-sm tracking-wide">CUPORA</span>
              <p className="text-[11px] text-slate-400">Sistema Integral de Reserva y Despacho Interurbano</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Arequipa • Camaná • Mollendo • Moquegua</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>Cero Sobreventa (Bloqueo Atómico)</span>
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            &copy; {new Date().getFullYear()} Cupora Platform. Desarrollado con 🚐 para el transporte peruano.
          </div>
        </div>
      </footer>

      {/* Login / Register Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
