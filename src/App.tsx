import React, { useState, useEffect } from 'react'
import { Navbar, ActiveTab } from './components/Navbar'
import { LandingView } from './views/LandingView'
import { PassengerView } from './views/PassengerView'
import { DriverView } from './views/DriverView'
import { AdminView } from './views/AdminView'
import { 
  getSavedTrips, 
  getSavedModels, 
  getSavedTickets, 
  subscribeToSync, 
  resetDemoData 
} from './services/storageService'
import { Trip, MinivanModel, TicketData } from './types'
import { Shield, Sparkles, MapPin, Phone, Mail, Zap } from 'lucide-react'

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing')
  const [trips, setTrips] = useState<Trip[]>([])
  const [models, setModels] = useState<MinivanModel[]>([])
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [syncToast, setSyncToast] = useState<string | null>(null)

  // Load initial data
  const loadAllData = () => {
    setTrips(getSavedTrips())
    setModels(getSavedModels())
    setTickets(getSavedTickets())
  }

  useEffect(() => {
    loadAllData()

    // Listen for cross-tab broadcasts
    const unsubscribe = subscribeToSync((type, payload) => {
      loadAllData()
      if (type === 'TRIPS_UPDATED') {
        setSyncToast('⚡ Sincronización en vivo: Los asientos y aforo se actualizaron.')
        setTimeout(() => setSyncToast(null), 3500)
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
      />

      {/* Floating Sync Notification Toast */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-teal-500/50 text-teal-300 text-xs px-4 py-3 rounded-2xl shadow-2xl shadow-teal-500/20 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Zap className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'landing' && <LandingView onNavigate={setActiveTab} />}
        {activeTab === 'passenger' && (
          <PassengerView
            trips={trips}
            models={models}
            onUpdateTrips={setTrips}
          />
        )}
        {activeTab === 'driver' && (
          <DriverView
            trips={trips}
            models={models}
            tickets={tickets}
            onUpdateTrips={setTrips}
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
      <footer className="border-t border-slate-900 bg-slate-950/80 py-10 text-xs text-slate-400 mt-auto">
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
    </div>
  )
}
