import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { MinivanSeatMap } from '../components/MinivanSeatMap'
import { TicketModal } from '../components/TicketModal'
import { Trip, Seat, TicketData, RouteOption, MinivanModel, UserAccount } from '../types'
import { DEFAULT_ROUTES, saveTrips, addTicket, getSavedTickets } from '../services/storageService'
import { Clock, ShieldCheck, CreditCard, Smartphone, Check, AlertCircle, ArrowRight, UserCheck, Ticket, Search, QrCode } from 'lucide-react'

interface PassengerViewProps {
  trips: Trip[]
  models: MinivanModel[]
  onUpdateTrips: (newTrips: Trip[]) => void
  currentUser: UserAccount | null
  onOpenLogin: () => void
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  trips,
  models,
  onUpdateTrips,
  currentUser,
  onOpenLogin
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(DEFAULT_ROUTES[0].id)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [passengerName, setPassengerName] = useState<string>(currentUser?.name || '')
  const [passengerDni, setPassengerDni] = useState<string>(currentUser?.dni || '')
  const [passengerPhone, setPassengerPhone] = useState<string>(currentUser?.phone || '')
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'card' | 'cash'>('yape')
  const [issuedTicket, setIssuedTicket] = useState<TicketData | null>(null)
  const [lockCountdown, setLockCountdown] = useState<number>(480)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [activeTabSub, setActiveTabSub] = useState<'booking' | 'my_tickets'>('booking')
  const [userTickets, setUserTickets] = useState<TicketData[]>([])

  // Load user tickets
  const refreshTickets = () => {
    const all = getSavedTickets()
    if (currentUser) {
      setUserTickets(all.filter(t => t.passengerDni === currentUser.dni || t.passengerName.toLowerCase() === currentUser.name.toLowerCase()))
    } else {
      setUserTickets(all)
    }
  }

  useEffect(() => {
    refreshTickets()
    if (currentUser) {
      setPassengerName(currentUser.name || '')
      setPassengerDni(currentUser.dni || '')
      setPassengerPhone(currentUser.phone || '')
    }
  }, [currentUser])

  const currentTrip = trips.find(t => t.routeId === selectedRouteId) || trips[0]
  const currentRoute = DEFAULT_ROUTES.find(r => r.id === selectedRouteId) || DEFAULT_ROUTES[0]
  const currentModel = models.find(m => m.id === currentTrip?.modelId) || models[0]

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
      setErrorMsg('Ingresa un número de DNI válido (mínimo 8 dígitos).')
      return
    }

    setIsProcessing(true)

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
      refreshTickets()

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
    <div className="space-y-6 pb-16">
      {/* Sub Header: Navigation between Booking & My Tickets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-teal-400" />
            <span>Portal del Pasajero</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentUser ? `Bienvenido, ${currentUser.name}` : 'Reserva de pasajes y gestión de boletos QR'}
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTabSub('booking')}
            className={`py-2 px-4 rounded-xl font-bold transition-all ${
              activeTabSub === 'booking'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reservar Asiento
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTabSub('my_tickets')
              refreshTickets()
            }}
            className={`py-2 px-4 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'my_tickets'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Mis Boletos ({userTickets.length})</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'my_tickets' ? (
        /* My Tickets View */
        <div className="space-y-4">
          {userTickets.length === 0 ? (
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No tienes boletos registrados aún</h3>
              <p className="text-xs max-w-sm mx-auto">
                Realiza tu primera reserva de pasaje en el croquis para generar tu pase de abordaje con código QR.
              </p>
              <button
                type="button"
                onClick={() => setActiveTabSub('booking')}
                className="py-2.5 px-5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/30 inline-block"
              >
                Comprar Pasaje Ahora
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => setIssuedTicket(t)}
                  className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 rounded-3xl p-5 shadow-xl transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                        {t.id}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">S/. {t.price.toFixed(2)}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                      {t.origin.split(' ')[0]} ➔ {t.destination.split(' ')[0]}
                    </h4>

                    <div className="text-xs text-slate-400 space-y-1 pt-1">
                      <p><strong>Asiento:</strong> #{t.seatNumber.toString().padStart(2, '0')}</p>
                      <p><strong>Pasajero:</strong> {t.passengerName} (DNI: {t.passengerDni})</p>
                      <p><strong>Salida:</strong> {t.departureTime} • {t.date}</p>
                      <p><strong>Minivan:</strong> {t.plate} ({t.driverName})</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-teal-400 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-4 h-4" />
                      <span>Ver Código QR</span>
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Booking View */
        <>
          {/* Route Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                  className={`p-4 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-teal-950/70 border-teal-500/80 shadow-lg shadow-teal-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>
                      {route.destination.split(' ')[0]}
                    </span>
                    <span className="font-mono text-teal-400 font-bold">S/. {route.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Origen: {route.origin.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    ⏱️ {route.duration} • Salidas c/{route.frequencyMinutes}m
                  </div>
                </button>
              )
            })}
          </div>

          {/* Seat Map & Checkout */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Seat Map */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    Paso 1: Elige tu Asiento
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {currentModel.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-mono">Placa: {currentTrip.plate}</span>
                  <span className="text-[10px] text-teal-400 font-medium">{currentTrip.driverName}</span>
                </div>
              </div>

              <MinivanSeatMap
                seats={currentTrip.seats}
                selectedSeatId={selectedSeat?.id || null}
                onSelectSeat={handleSeatSelect}
                model={currentModel}
              />
            </div>

            {/* Passenger Form & Checkout */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    Paso 2: Datos de Pasajero
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Resumen de Reserva
                  </h3>
                </div>

                {!currentUser && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="text-[11px] text-teal-400 hover:underline font-semibold"
                  >
                    ¿Ya tienes cuenta?
                  </button>
                )}
              </div>

              {selectedSeat ? (
                <div className="bg-teal-950/50 border border-teal-500/40 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-teal-300 font-bold block">
                      Asiento #{selectedSeat.number.toString().padStart(2, '0')} Seleccionado
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ubicación: {selectedSeat.label}
                    </span>
                  </div>
                  <div className="text-right flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-950/70 px-2.5 py-1 rounded-xl border border-amber-500/40">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatCountdown(lockCountdown)}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-5 text-center text-slate-400 text-xs">
                  <p>Toca un asiento disponible en el croquis para comenzar.</p>
                </div>
              )}

              {errorMsg && (
                <div className="bg-rose-950/70 border border-rose-500/60 rounded-2xl p-3 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleConfirmBooking} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nombre Completo del Pasajero *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez Quispe"
                    value={passengerName}
                    onChange={e => setPassengerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      DNI / Documento *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="8 dígitos"
                      value={passengerDni}
                      onChange={e => setPassengerDni(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Celular
                    </label>
                    <input
                      type="tel"
                      placeholder="987 654 321"
                      value={passengerPhone}
                      onChange={e => setPassengerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {(['yape', 'plin', 'card', 'cash'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-1 rounded-xl text-center border font-bold capitalize transition-all ${
                          paymentMethod === method
                            ? 'bg-teal-950 border-teal-500 text-teal-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Total a Pagar:</span>
                  <span className="text-xl font-extrabold text-teal-400 font-mono">
                    S/. {selectedSeat ? selectedSeat.price.toFixed(2) : currentRoute.basePrice.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !selectedSeat}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                    !selectedSeat || isProcessing
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-500/25 cursor-pointer'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'Confirmando...' : 'Confirmar y Ver Boleto QR'}</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Ticket Modal */}
      <TicketModal ticket={issuedTicket} onClose={() => setIssuedTicket(null)} />
    </div>
  )
}
