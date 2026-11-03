import React, { useState, useEffect } from 'react'
import { MinivanSeatMap } from '../components/MinivanSeatMap'
import { QRScannerModal } from '../components/QRScannerModal'
import { RefundModal } from '../components/RefundModal'
import { MinivanLayoutBuilderModal } from '../components/MinivanLayoutBuilderModal'
import { Trip, Seat, TicketData, MinivanModel, TripStatus, UserAccount } from '../types'
import { saveTrips, saveTickets, saveModels, broadcastChange } from '../services/storageService'
import { Bus, QrCode, Store, Users, CheckCircle2, AlertCircle, Printer, ArrowRight, ShieldCheck, DollarSign, X, RotateCcw, User, Phone, SlidersHorizontal } from 'lucide-react'

interface DriverViewProps {
  trips: Trip[]
  models: MinivanModel[]
  tickets: TicketData[]
  onUpdateTrips: (newTrips: Trip[]) => void
  onUpdateModels?: (models: MinivanModel[]) => void
  currentUser: UserAccount | null
  onOpenLogin: () => void
}

export const DriverView: React.FC<DriverViewProps> = ({
  trips,
  models,
  tickets,
  onUpdateTrips,
  onUpdateModels,
  currentUser,
  onOpenLogin
}) => {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '')
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false)
  const [isLayoutBuilderOpen, setIsLayoutBuilderOpen] = useState<boolean>(false)
  const [selectedSeatForAction, setSelectedSeatForAction] = useState<Seat | null>(null)
  const [seatForRefund, setSeatForRefund] = useState<Seat | null>(null)
  const [windowBuyerName, setWindowBuyerName] = useState<string>('')
  const [windowBuyerDni, setWindowBuyerDni] = useState<string>('')
  const [scanNotification, setScanNotification] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.role === 'driver' && currentUser.assignedPlate) {
      const match = trips.find(t => t.plate === currentUser.assignedPlate)
      if (match) {
        setSelectedTripId(match.id)
      }
    }
  }, [currentUser, trips])

  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0]
  const currentModel = models.find(m => m.id === currentTrip?.modelId) || models[0]

  if (!currentTrip) return null

  const totalSeats = currentTrip.seats.length
  const occupiedSeats = currentTrip.seats.filter(s => s.status !== 'available').length
  const availableSeats = totalSeats - occupiedSeats
  const appSales = currentTrip.seats.filter(s => s.status === 'sold_app').length
  const windowSales = currentTrip.seats.filter(s => s.status === 'sold_window').length
  const totalCollected = currentTrip.seats.reduce((acc, s) => s.status !== 'available' ? acc + s.price : acc, 0)

  const handleDriverSeatClick = (seat: Seat) => {
    setSelectedSeatForAction(seat)
    if (seat.status === 'available') {
      setWindowBuyerName('Pasajero Paradero')
      setWindowBuyerDni('')
    }
  }

  const handleConfirmWindowSale = () => {
    if (!selectedSeatForAction) return

    const updatedTrips = trips.map(t => {
      if (t.id === currentTrip.id) {
        return {
          ...t,
          seats: t.seats.map(s => {
            if (s.id === selectedSeatForAction.id) {
              return {
                ...s,
                status: 'sold_window' as const,
                passengerName: windowBuyerName.trim() || 'Pasajero Paradero (Ventanilla)',
                passengerDni: windowBuyerDni.trim() || 'S/D',
                paymentMethod: 'cash' as const
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
    setSelectedSeatForAction(null)
    setScanNotification('Venta registrada en efectivo por ventanilla/paradero.')
    setTimeout(() => setScanNotification(null), 4000)
  }

  const handleProcessRefund = (seat: Seat, reason: string) => {
    const updatedTrips = trips.map(t => {
      if (t.id === currentTrip.id) {
        return {
          ...t,
          seats: t.seats.map(s => {
            if (s.id === seat.id) {
              return {
                ...s,
                status: 'available' as const,
                passengerName: undefined,
                passengerDni: undefined,
                ticketCode: undefined,
                paymentMethod: undefined,
                lockedAt: undefined,
                refunded: true,
                refundedAt: new Date().toLocaleTimeString('es-PE')
              }
            }
            return s
          })
        }
      }
      return t
    })

    // Update tickets status to refunded
    const updatedTickets = tickets.map(t => {
      if (t.tripId === currentTrip.id && t.seatNumber === seat.number) {
        return {
          ...t,
          status: 'refunded' as const,
          refundedAt: new Date().toLocaleTimeString('es-PE'),
          refundReason: reason
        }
      }
      return t
    })

    saveTrips(updatedTrips)
    saveTickets(updatedTickets)
    onUpdateTrips(updatedTrips)
    setSelectedSeatForAction(null)
    setSeatForRefund(null)

    setScanNotification(`💰 Devolución efectuada: Se reembolsaron S/. ${seat.price.toFixed(2)} por ${seat.paymentMethod?.toUpperCase() || 'EFECTIVO'}. El Asiento #${seat.number} ha quedado libre.`)
    setTimeout(() => setScanNotification(null), 5000)
  }

  const handleSaveCustomizedModel = (updatedModel: MinivanModel) => {
    const updated = models.map(m => m.id === updatedModel.id ? updatedModel : m)
    saveModels(updated)
    onUpdateModels?.(updated)
    setIsLayoutBuilderOpen(false)
    setScanNotification('Se actualizó la distribución de asientos de tu minivan.')
    setTimeout(() => setScanNotification(null), 4000)
  }

  const handleStatusChange = (status: TripStatus) => {
    const updatedTrips = trips.map(t => {
      if (t.id === currentTrip.id) {
        return { ...t, status }
      }
      return t
    })
    saveTrips(updatedTrips)
    onUpdateTrips(updatedTrips)
  }

  const handleQRScanSuccess = (payload: string) => {
    setScanNotification(`Boleto QR Validado con éxito: ${payload}`)
    setTimeout(() => setScanNotification(null), 5000)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner: Minivan Unit Status & Quick Switch */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Bus className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                  Placa: {currentTrip.plate}
                </span>
                <span className="text-xs text-slate-400">
                  {currentModel.name}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Cabina del Conductor • {currentUser?.role === 'driver' ? currentUser.name : currentTrip.driverName}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLayoutBuilderOpen(true)}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-teal-500/50 text-teal-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              title="Personaliza las sillas, pasadizos y puerta de tu minivan"
            >
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Modificar Croquis de Mi Auto</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Escanear Boleto QR</span>
            </button>

            <select
              value={selectedTripId}
              onChange={e => setSelectedTripId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-teal-500"
            >
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>
                  {trip.plate} - {trip.routeId.replace('aqp-', 'Arequipa a ').toUpperCase()} ({trip.departureTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Aforo Total</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{occupiedSeats} / {totalSeats}</span>
              <span className="text-xs text-teal-400 font-semibold">
                ({availableSeats} libres)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Venta en Ventanilla</span>
            <span className="text-2xl font-black text-rose-400 block mt-1">{windowSales} asientos</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Venta por App</span>
            <span className="text-2xl font-black text-indigo-400 block mt-1">{appSales} boletos</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Recaudación en Caja</span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">S/. {totalCollected.toFixed(2)}</span>
          </div>
        </div>

        {/* Operational Status Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium">Estado Operativo de la Minivan:</span>
          <div className="flex flex-wrap items-center gap-2">
            {(['boarding', 'full', 'in_transit', 'completed'] as TripStatus[]).map(statusKey => {
              const isActive = currentTrip.status === statusKey
              const labels = {
                boarding: '1. Embarcando Pasajeros',
                full: '2. Minivan Llena (Aforo Completo)',
                in_transit: '3. En Ruta Interurbana',
                completed: '4. Llegada a Destino'
              }

              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => handleStatusChange(statusKey)}
                  className={`py-1.5 px-3 rounded-xl font-semibold border transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {labels[statusKey]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {scanNotification && (
        <div className="bg-teal-950/90 border border-teal-500/60 rounded-2xl p-4 text-xs text-teal-300 flex items-center gap-3 animate-in fade-in shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{scanNotification}</span>
        </div>
      )}

      {/* Seat Map & Driver Controls */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Control de Asientos en Vivo
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Toca cualquier asiento para gestionarlo o devolver pasaje
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-teal-400">Tarifa fija: S/. {currentModel.defaultPrice.toFixed(2)}</span>
            </div>
          </div>

          <MinivanSeatMap
            seats={currentTrip.seats}
            selectedSeatId={selectedSeatForAction?.id || null}
            isDriverView={true}
            onDriverSeatAction={handleDriverSeatClick}
            model={currentModel}
          />
        </div>

        {/* Seat Action Panel */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>Acciones Rápidas del Chofer</span>
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Ventanilla & Devoluciones
            </h3>
          </div>

          {selectedSeatForAction ? (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Asiento #{selectedSeatForAction.number.toString().padStart(2, '0')} ({selectedSeatForAction.label})
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedSeatForAction.status === 'available'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : selectedSeatForAction.status === 'sold_window'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                  }`}>
                    {selectedSeatForAction.status === 'available' ? 'LIBRE' : selectedSeatForAction.status === 'sold_window' ? 'VENTANILLA' : 'VENDIDO APP'}
                  </span>
                </div>

                {selectedSeatForAction.passengerName && (
                  <div className="text-xs text-slate-300 pt-1 border-t border-slate-800 space-y-0.5">
                    <p><strong>Pasajero:</strong> {selectedSeatForAction.passengerName}</p>
                    <p><strong>DNI:</strong> {selectedSeatForAction.passengerDni || 'No registrado'}</p>
                    <p className="text-teal-400"><strong>Método Pago:</strong> {selectedSeatForAction.paymentMethod?.toUpperCase() || 'EFECTIVO'}</p>
                  </div>
                )}
              </div>

              {selectedSeatForAction.status === 'available' ? (
                /* Free seat: Sell in window */
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-slate-300">
                    ¿Un pasajero pagó en efectivo en el paradero? Márcalo aquí para bloquearlo al instante:
                  </p>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nombre o Apodo del Pasajero</label>
                    <input
                      type="text"
                      placeholder="Ej. Juan Paradero"
                      value={windowBuyerName}
                      onChange={e => setWindowBuyerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">DNI (Opcional en paradero)</label>
                    <input
                      type="text"
                      placeholder="Ej. 29481920"
                      value={windowBuyerDni}
                      onChange={e => setWindowBuyerDni(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmWindowSale}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Cobrar S/. {selectedSeatForAction.price.toFixed(2)} (Efectivo Ventanilla)</span>
                  </button>
                </div>
              ) : (
                /* Occupied seat: Refund / Cancel option */
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-slate-300">
                    ¿El cliente ya no va a viajar o solicita su dinero de vuelta?
                  </p>

                  <button
                    type="button"
                    onClick={() => setSeatForRefund(selectedSeatForAction)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Devolver Pasaje & Reembolsar S/. {selectedSeatForAction.price.toFixed(2)}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
              <Store className="w-8 h-8 text-rose-400/50 mx-auto mb-2" />
              <p>Toca cualquier asiento en el croquis para cobrarlo en ventanilla o tramitar una devolución si el cliente ya no viaja.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manifest Table with Refund Buttons */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>Lista de Pasajeros & Control de Pasajes</span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualiza quién abordó, canal de venta o gestiona reembolsos si el cliente canceló su viaje
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors self-start"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Manifiesto</span>
          </button>
        </div>

        {/* Mobile Passenger Cards (Clean Touch UI on Phones) */}
        <div className="md:hidden space-y-3">
          {currentTrip.seats.filter(s => s.status !== 'available').length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Aún no hay pasajeros registrados en esta unidad.
            </div>
          ) : (
            currentTrip.seats.filter(s => s.status !== 'available').map(seat => (
              <div key={seat.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/40 flex items-center justify-center font-mono font-black text-teal-300 text-xs shadow-inner">
                      #{seat.number.toString().padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {seat.passengerName || 'Pasajero no registrado'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        DNI: {seat.passengerDni || '-'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    S/. {seat.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    seat.status === 'sold_window'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                      : 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
                  }`}>
                    {seat.status === 'sold_window' ? 'Ventanilla' : `App ${seat.paymentMethod?.toUpperCase() || 'YAPE'}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSeatForRefund(seat)}
                    className="py-1.5 px-3 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reembolsar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Asiento</th>
                <th className="py-3 px-3">Nombre del Pasajero</th>
                <th className="py-3 px-3">DNI / Doc</th>
                <th className="py-3 px-3">Canal de Pago</th>
                <th className="py-3 px-3">Importe</th>
                <th className="py-3 px-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentTrip.seats.filter(s => s.status !== 'available').length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    Aún no hay pasajeros registrados en esta unidad.
                  </td>
                </tr>
              ) : (
                currentTrip.seats.filter(s => s.status !== 'available').map(seat => (
                  <tr key={seat.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-teal-400">
                      #{seat.number.toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {seat.passengerName || 'Pasajero no registrado'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {seat.passengerDni || '-'}
                    </td>
                    <td className="py-3 px-3">
                      {seat.status === 'sold_window' ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 text-[10px] font-semibold">
                          Ventanilla (Efectivo)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 text-[10px] font-semibold">
                          App ({seat.paymentMethod?.toUpperCase() || 'YAPE'})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                      S/. {seat.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => setSeatForRefund(seat)}
                        className="py-1 px-2.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Reembolsar y liberar este asiento"
                      >
                        <RotateCcw className="w-3 h-3 text-rose-400" />
                        <span>Reembolsar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
        tickets={tickets}
        currentSeats={currentTrip.seats}
      />

      {/* Refund Modal */}
      <RefundModal
        isOpen={!!seatForRefund}
        onClose={() => setSeatForRefund(null)}
        seat={seatForRefund}
        trip={currentTrip}
        onConfirmRefund={handleProcessRefund}
      />

      {/* Driver Minivan Layout Builder Modal */}
      {isLayoutBuilderOpen && (
        <MinivanLayoutBuilderModal
          isOpen={isLayoutBuilderOpen}
          onClose={() => setIsLayoutBuilderOpen(false)}
          modelToEdit={currentModel}
          onSaveModel={handleSaveCustomizedModel}
          trips={trips}
          onUpdateTrips={onUpdateTrips}
        />
      )}
    </div>
  )
}
