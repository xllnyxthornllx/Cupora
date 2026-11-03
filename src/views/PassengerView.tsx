import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { MinivanSeatMap } from '../components/MinivanSeatMap'
import { TicketModal } from '../components/TicketModal'
import { Trip, Seat, TicketData, RouteOption, MinivanModel } from '../types'
import { DEFAULT_ROUTES, saveTrips, addTicket } from '../services/storageService'
import { Clock, ShieldCheck, CreditCard, Smartphone, Check, AlertCircle, ArrowRight, UserCheck } from 'lucide-react'

interface PassengerViewProps {
  trips: Trip[]
  models: MinivanModel[]
  onUpdateTrips: (newTrips: Trip[]) => void
}

export const PassengerView: React.FC<PassengerViewProps> = ({ trips, models, onUpdateTrips }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(DEFAULT_ROUTES[0].id)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [passengerName, setPassengerName] = useState<string>('')
  const [passengerDni, setPassengerDni] = useState<string>('')
  const [passengerPhone, setPassengerPhone] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'card' | 'cash'>('yape')
  const [issuedTicket, setIssuedTicket] = useState<TicketData | null>(null)
  const [lockCountdown, setLockCountdown] = useState<number>(480) // 8 minutes in seconds
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  // Find the trip associated with the selected route
  const currentTrip = trips.find(t => t.routeId === selectedRouteId) || trips[0]
  const currentRoute = DEFAULT_ROUTES.find(r => r.id === selectedRouteId) || DEFAULT_ROUTES[0]
  const currentModel = models.find(m => m.id === currentTrip?.modelId) || models[0]

  // Countdown timer for locked seat
  useEffect(() => {
    let timer: number
    if (selectedSeat) {
      setLockCountdown(480)
      timer = window.setInterval(() => {
        setLockCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setSelectedSeat(null)
            setErrorMsg('El tiempo de reserva de 8 minutos expiró. El asiento se ha liberado.')
            return 480
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [selectedSeat?.id])

  const handleSeatSelect = (seat: Seat) => {
    setErrorMsg('')
    if (selectedSeat?.id === seat.id) {
      setSelectedSeat(null)
    } else {
      setSelectedSeat(seat)
    }
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!selectedSeat) {
      setErrorMsg('Por favor selecciona un asiento disponible en el croquis.')
      return
    }

    if (!passengerName.trim() || passengerName.trim().length < 3) {
      setErrorMsg('Ingresa el nombre completo del pasajero.')
      return
    }

    if (!passengerDni.trim() || passengerDni.trim().length < 8) {
      setErrorMsg('Ingresa un número de DNI o documento válido (mínimo 8 dígitos).')
      return
    }

    setIsProcessing(true)

    // Simulate 600ms atomic locking & ticket generation
    setTimeout(() => {
      const ticketId = `CUP-${currentModel.plate.replace('-', '')}-${selectedSeat.number.toString().padStart(2, '0')}`
      const newTicket: TicketData = {
        id: ticketId,
        tripId: currentTrip.id,
        origin: currentRoute.origin,
        destination: currentRoute.destination,
        seatNumber: selectedSeat.number,
        passengerName: passengerName.trim(),
        passengerDni: passengerDni.trim(),
        passengerPhone: passengerPhone.trim() || 'No especificado',
        price: selectedSeat.price,
        plate: currentTrip.plate,
        driverName: currentTrip.driverName,
        departureTime: currentTrip.departureTime,
        date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        status: 'valid',
        qrPayload: `CUPORA-TICKET|${ticketId}|${currentTrip.plate}|SEAT:${selectedSeat.number}|DNI:${passengerDni.trim()}|JWT_SIG_VALID`,
        purchasedAt: new Date().toLocaleTimeString('es-PE')
      }

      // Update seats in trip
      const updatedTrips = trips.map(t => {
        if (t.id === currentTrip.id) {
          return {
            ...t,
            seats: t.seats.map(s => {
              if (s.id === selectedSeat.id) {
                return {
                  ...s,
                  status: 'sold_app' as const,
                  passengerName: passengerName.trim(),
                  passengerDni: passengerDni.trim(),
                  ticketCode: ticketId,
                  paymentMethod: paymentMethod
                }
              }
              return s
            })
          }
        }
        return t
      })

      saveTrips(updatedTrips)
      onUpdateTrips(updatedTrips)
      addTicket(newTicket)

      // Launch victory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })

      setIsProcessing(false)
      setIssuedTicket(newTicket)
      setSelectedSeat(null)
    }, 600)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Route Selector Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-teal-400" />
              <span>Reserva de Pasajes Interurbanos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecciona tu destino, elige tu asiento en tiempo real y abona con Yape, Plin o Tarjeta.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400">Salidas continuas:</span>
            <span className="text-teal-400 font-bold">Cada {currentRoute.frequencyMinutes} min</span>
          </div>
        </div>

        {/* Route Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          {DEFAULT_ROUTES.map(route => {
            const isSelected = selectedRouteId === route.id
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => {
                  setSelectedRouteId(route.id)
                  setSelectedSeat(null)
                  setErrorMsg('')
                }}
                className={`p-3.5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-teal-950/60 border-teal-500/80 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>
                    {route.destination.split(' ')[0]}
                  </span>
                  <span className="font-mono text-teal-400 font-bold">S/. {route.basePrice.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Desde: {route.origin.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  ⏱️ {route.duration} aprox.
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Two-Column Layout: Seat Map & Passenger Checkout Form */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real Peruvian Minivan Seat Map (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400">
                Paso 1: Elige tu Asiento
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {currentModel.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono">Placa: {currentTrip.plate}</span>
              <span className="text-[10px] text-teal-400/90 font-medium">{currentTrip.driverName}</span>
            </div>
          </div>

          {/* Seat Map */}
          <MinivanSeatMap
            seats={currentTrip.seats}
            selectedSeatId={selectedSeat?.id || null}
            onSelectSeat={handleSeatSelect}
            model={currentModel}
          />
        </div>

        {/* Right Column: Checkout & Passenger Details (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400">
              Paso 2: Datos y Confirmación
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Resumen de Reserva
            </h3>
          </div>

          {/* Active Seat Lock Status */}
          {selectedSeat ? (
            <div className="bg-teal-950/40 border border-teal-500/40 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-300 font-semibold block">
                  Asiento #{selectedSeat.number.toString().padStart(2, '0')} Seleccionado
                </span>
                <span className="text-[11px] text-slate-400">
                  Ubicación: {selectedSeat.label}
                </span>
              </div>
              <div className="text-right flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatCountdown(lockCountdown)}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-dashed border-slate-700/80 rounded-2xl p-6 text-center text-slate-400 text-xs">
              <p>Toca un asiento verde disponible en el croquis de la izquierda para comenzar.</p>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="bg-rose-950/60 border border-rose-500/50 rounded-2xl p-3.5 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nombre y Apellidos del Pasajero *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Juan Pérez Quispe"
                value={passengerName}
                onChange={e => setPassengerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  DNI / Documento *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="8 dígitos"
                  value={passengerDni}
                  onChange={e => setPassengerDni(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Celular / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="987 654 321"
                  value={passengerPhone}
                  onChange={e => setPassengerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Método de Pago
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('yape')}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    paymentMethod === 'yape'
                      ? 'bg-purple-950/60 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Yape
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('plin')}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    paymentMethod === 'plin'
                      ? 'bg-sky-950/60 border-sky-500 text-sky-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Plin
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Tarjeta
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Efectivo
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Pasaje Interurbano ({currentRoute.destination.split(' ')[0]}):</span>
                <span>S/. {selectedSeat ? selectedSeat.price.toFixed(2) : currentRoute.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tasa de Embarque / Terminal:</span>
                <span className="text-teal-400">Gratis (S/. 0.00)</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between text-white font-bold text-sm">
                <span>Total a Pagar:</span>
                <span className="text-teal-400 text-base">
                  S/. {selectedSeat ? selectedSeat.price.toFixed(2) : currentRoute.basePrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !selectedSeat}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                !selectedSeat || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-500/25 cursor-pointer'
              }`}
            >
              {isProcessing ? (
                <span>Procesando pago y generando boleto QR...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar y Obtener Boleto Digital</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Ticket Modal */}
      <TicketModal ticket={issuedTicket} onClose={() => setIssuedTicket(null)} />
    </div>
  )
}
