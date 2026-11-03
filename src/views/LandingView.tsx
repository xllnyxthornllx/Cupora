import React from 'react'
import { Bus, Smartphone, ShieldCheck, QrCode, Clock, MapPin, ArrowRight, Users, CheckCircle, Zap } from 'lucide-react'
import { ActiveTab } from '../components/Navbar'

interface LandingViewProps {
  onNavigate: (tab: ActiveTab) => void
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section with the Peruvian Minivan Terminal Photograph */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        {/* Background Image Container with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/minivan-terminal.png"
            alt="Minivan Interurbana en Paradero de Perú"
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
          <div className="absolute inset-0 bg-radial-gradient from-teal-500/10 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Sistema Integral de Reserva y Despacho Interurbano</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Viaja seguro en minivan. <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              Cero sobreventa, boleto en mano.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Diseñado para las rutas de minivanes de Arequipa, Camaná, Mollendo y todo el Perú. 
            Elige tu asiento en el croquis exacto del vehículo, compra online o en ventanilla y valida con código QR sin necesidad de conexión a internet.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('passenger')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-sm transition-all duration-200 shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2 group"
            >
              <Smartphone className="w-5 h-5" />
              <span>Reservar Pasaje (App Pasajero)</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('driver')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all duration-200 border border-slate-700/80 hover:border-slate-600 flex items-center justify-center gap-2 shadow-lg"
            >
              <Bus className="w-5 h-5 text-teal-400" />
              <span>Modo Chofer (Escanear QR y Ventanilla)</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 mt-10 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-2xl font-black text-teal-400">100%</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Asientos Garantizados</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-2xl font-black text-teal-400">8 min</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Bloqueo Atómico</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-2xl font-black text-teal-400">Offline</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Validación QR en Ruta</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-2xl font-black text-teal-400">11 a 15</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Asientos por Minivan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Role Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tres interfaces conectadas en tiempo real
          </h2>
          <p className="text-sm text-slate-400">
            Abre distintas ventanas o prueba en tu móvil: las acciones se sincronizan inmediatamente.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Pasajero */}
          <div 
            onClick={() => onNavigate('passenger')}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                PWA para Pasajeros
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elige tu ruta (Arequipa - Camaná, Mollendo, Moquegua), selecciona tu asiento favorito en el croquis 3D de la minivan y recibe tu boleto QR con código de seguridad.
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-teal-400 text-xs font-semibold">
              <span>Probar reserva online</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Conductor */}
          <div 
            onClick={() => onNavigate('driver')}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                PWA para Choferes
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Escanea los boletos con la cámara del celular. Si un pasajero llega al paradero y paga en efectivo, el chofer toca el asiento libre y lo marca como vendido al instante.
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-emerald-400 text-xs font-semibold">
              <span>Probar cabina y escáner</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Despachador */}
          <div 
            onClick={() => onNavigate('admin')}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Panel de Despacho & Flota
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Administra los modelos de minivanes (Renault Master, Sprinter, HiAce), asigna frecuencias de salida, revisa el aforo total y el arqueo de caja de la jornada.
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-cyan-400 text-xs font-semibold">
              <span>Ver panel de control</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Details: Cero Sobreventa & Ventanilla */}
      <section className="rounded-3xl bg-slate-900/50 border border-slate-800 p-8 sm:p-12 relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Resolviendo el problema real de los paraderos</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¿Ventanilla física o App? <br />
              <span className="text-teal-400">Ambos conviven en perfecta armonía.</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              En las empresas interurbanas de minivanes, muchos pasajeros compran en ventanilla o directamente con el conductor antes de subir. Cupora permite que el chofer o la taquilla marquen asientos ocupados en efectivo en 1 segundo, actualizando la app de todos los usuarios para que nadie reserve un asiento ya ocupado.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Bloqueo temporal de 8 minutos mientras el pasajero completa el pago digital.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Cobro inmediato en ventanilla para pasajeros que pagan con monedas o billetes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Manifiesto de pasajeros digital para fiscalización SUTRAN / Municipal sin papeles sueltos.</span>
              </li>
            </ul>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl">
            <img 
              src="/assets/minivan-terminal.png" 
              alt="Minivan Renault Master Camaná" 
              className="w-full h-80 object-cover object-center"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
              <span className="text-xs font-bold text-white block">Unidad Renault Master (Placa Z4V-753)</span>
              <span className="text-[11px] text-teal-400 font-mono">Ruta oficial: Arequipa ➔ Camaná (Paradero Terminal)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
