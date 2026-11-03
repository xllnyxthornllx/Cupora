import React, { useState } from 'react'
import { MinivanSeatMap } from '../components/MinivanSeatMap'
import { QRScannerModal } from '../components/QRScannerModal'
import { Trip, Seat, TicketData, MinivanModel, TripStatus } from '../types'
import { saveTrips, broadcastChange } from '../services/storageService'
import { Bus, QrCode, Store, Users, CheckCircle2, AlertCircle, Printer, ArrowRight, ShieldCheck, DollarSign, X } from 'lucide-react'

interface DriverViewProps {
  trips: Trip[]
  models: MinivanModel[]
  tickets: TicketData[]
  onUpdateTrips: (newTrips: Trip[]) => void
}

export const DriverView: React.FC<DriverViewProps> = ({
  trips,
  models,
  tickets,
  onUpdateTrips
}) => {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '')
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false)
  const [selectedSeatForAction, setSelectedSeatForAction] = useState<Seat | null>(null)
  const [windowBuyerName, setWindowBuyerName] = useState<string>('')
  const [windowBuyerDni, setWindowBuyerDni] = useState<string>('')
  const [scanNotification, setScanNotification] = useState<string | null>(null)

  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0]
  const currentModel = models.find(m => m.id === currentTrip?.modelId) || models[0]

  if (!currentTrip) return null

  // Calculate statistics
  const totalSeats = currentTrip.seats.length
  const occupiedSeats = currentTrip.seats.filter(s => s.status !== 'available').length
  const availableSeats = totalSeats - occupiedSeats
  const appSales = currentTrip.seats.filter(s => s.status === 'sold_app').length
  const windowSales = currentTrip.seats.filter(s => s.status === 'sold_window').length
  const totalCollected = currentTrip.seats.reduce((acc, s) => s.status !== 'available' ? acc + s.price : acc, 0)

  // Handle seat click in driver mode
  const handleDriverSeatClick = (seat: Seat) => {
    setSelectedSeatForAction(seat)
    if (seat.status === 'available') {
      setWindowBuyerName('Pasajero Paradero')
      setWindowBuyerDni('')
    }
  }

  // Confirm window ticket sale
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
  }

  // Release/Cancel a seat
  const handleReleaseSeat = () => {
    if (!selectedSeatForAction) return

    const updatedTrips = trips.map(t => {
      if (t.id === currentTrip.id) {
        return {
          ...t,
          seats: t.seats.map(s => {
            if (s.id === selectedSeatForAction.id) {
              return {
                ...s,
                status: 'available' as const,
                passengerName: undefined,
                passengerDni: undefined,
                ticketCode: undefined,
                paymentMethod: undefined,
                lockedAt: undefined
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
  }

  // Change Trip Status
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
    <div className="space-y-8 pb-16">
      {/* Top Banner: Minivan Unit Status & Quick Switch */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
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
                Cabina del Conductor • {currentTrip.driverName}
              </h2>
            </div>
          </div>

          {/* Scanner Button and Unit Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Escanear Boleto QR</span>
            </button>

            {/* Trip selector */}
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
            <span className="text-xs text-slate-400 block">Venta en Ventanilla / Paradero</span>
            <span className="text-2xl font-black text-rose-400 block mt-1">{windowSales} asientos</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Venta por App Cupora</span>
            <span className="text-2xl font-black text-indigo-400 block mt-1">{appSales} boletos</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Recaudación de Viaje</span>
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

      {/* Notification if QR scanned */}
      {scanNotification && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{scanNotification}</span>
        </div>
      )}

      {/* Main Two-Column Layout: Minivan Croquis & Driver Actions */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Minivan Seat Map (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400">
                Control de Asientos en Vivo
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Toca cualquier asiento para gestionarlo
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Tarifa fija:</span>
              <span className="text-xs font-mono font-bold text-teal-400 ml-1">S/. {currentModel.defaultPrice.toFixed(2)}</span>
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

        {/* Right Column: Ventanilla Direct Sale Form / Seat Details (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>Venta en Ventanilla / Paradero</span>
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Gestión Inmediata de Asiento
            </h3>
          </div>

          {selectedSeatForAction ? (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Asiento #{selectedSeatForAction.number.toString().padStart(2, '0')} ({selectedSeatForAction.label})
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
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
                  <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                    <p><strong>Pasajero:</strong> {selectedSeatForAction.passengerName}</p>
                    <p><strong>DNI:</strong> {selectedSeatForAction.passengerDni || 'No registrado'}</p>
                    {selectedSeatForAction.ticketCode && (
                      <p className="text-teal-400 font-mono mt-0.5">Código: {selectedSeatForAction.ticketCode}</p>
                    )}
                  </div>
                )}
              </div>

              {selectedSeatForAction.status === 'available' ? (
                /* Sell in window form */
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-300 font-medium">
                    ¿Un pasajero pagó en efectivo en el paradero? Márcalo aquí para que nadie en la app lo reserve:
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
                /* Release occupied seat */
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-400">
                    Si el pasajero canceló o no se presentó, puedes liberar este asiento para que vuelva a estar a la venta:
                  </p>
                  <button
                    type="button"
                    onClick={handleReleaseSeat}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4 text-rose-400" />
                    <span>Liberar Asiento #{selectedSeatForAction.number} (Volver a Disponible)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
              <Store className="w-8 h-8 text-rose-400/50 mx-auto mb-2" />
              <p>Toca cualquier asiento en el croquis para cobrarlo en efectivo por ventanilla o para ver los datos del pasajero.</p>
            </div>
          )}
        </div>
      </div>

      {/* Digital Passenger Manifest Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>Manifiesto Oficial de Pasajeros a Bordo</span>
            </h3>
            <p className="text-xs text-slate-400">
              Listo para fiscalización SUTRAN / Municipal en carretera
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Asiento</th>
                <th className="py-3 px-3">Nombre del Pasajero</th>
                <th className="py-3 px-3">DNI / Doc</th>
                <th className="py-3 px-3">Canal de Venta</th>
                <th className="py-3 px-3">Importe</th>
                <th className="py-3 px-3">Estado</th>
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
                          App Online ({seat.paymentMethod?.toUpperCase() || 'QR'})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                      S/. {seat.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Abordado</span>
                      </span>
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
    </div>
  )
}
