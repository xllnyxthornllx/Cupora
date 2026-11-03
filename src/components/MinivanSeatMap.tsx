import React from 'react'
import { Seat, MinivanModel, FreeformLayoutItem } from '../types'
import { Armchair, DoorOpen, Luggage } from 'lucide-react'

interface MinivanSeatMapProps {
  seats: Seat[]
  selectedSeatId?: number | null
  onSelectSeat?: (seat: Seat) => void
  isDriverView?: boolean
  onDriverSeatAction?: (seat: Seat) => void
  model: MinivanModel
}

export const MinivanSeatMap: React.FC<MinivanSeatMapProps> = ({
  seats,
  selectedSeatId,
  onSelectSeat,
  isDriverView = false,
  onDriverSeatAction,
  model
}) => {
  const getSeatColor = (seat: Seat) => {
    if (selectedSeatId === seat.id) {
      return 'bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-white shadow-xl shadow-teal-500/50 ring-2 ring-white scale-105 z-20'
    }

    switch (seat.status) {
      case 'available':
        return isDriverView
          ? 'bg-slate-800/95 border-2 border-slate-700 hover:border-emerald-400 text-white hover:text-white cursor-pointer hover:bg-slate-700 active:scale-95 shadow-md'
          : 'bg-slate-800/95 border-2 border-emerald-500/70 hover:border-emerald-300 text-white hover:text-white cursor-pointer hover:bg-slate-700 active:scale-95 shadow-md shadow-emerald-500/10'
      case 'locked':
        return 'bg-amber-950/90 border-2 border-amber-500/80 text-amber-300 cursor-not-allowed opacity-90'
      case 'sold_app':
        return 'bg-indigo-950/95 border-2 border-indigo-500/80 text-indigo-200 cursor-pointer shadow-md active:scale-95'
      case 'sold_window':
        return 'bg-rose-950/95 border-2 border-rose-500/80 text-rose-200 cursor-pointer shadow-md active:scale-95'
      default:
        return 'bg-slate-800 text-slate-400'
    }
  }

  const handleSeatClick = (seat: Seat) => {
    if (isDriverView) {
      onDriverSeatAction?.(seat)
      return
    }

    if (seat.status === 'available' || seat.id === selectedSeatId) {
      onSelectSeat?.(seat)
    }
  }

  const total = seats.length
  const availableCount = seats.filter(s => s.status === 'available').length
  const occupiedCount = total - availableCount

  const freeformItems: FreeformLayoutItem[] = model.freeformElements && model.freeformElements.length > 0
    ? model.freeformElements
    : []

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto select-none">
      {/* Minivan Vehicle Frame Container */}
      <div className="w-full bg-slate-900/95 rounded-3xl p-4 sm:p-5 border-2 border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-teal-500/80 to-transparent"></div>

        {/* Front Windshield Header with Realistic Cabin Hood */}
        <div className="relative mb-3 pb-2 border-b border-slate-800">
          <div className="h-11 w-full bg-slate-950 rounded-t-2xl border border-slate-800 flex items-center justify-between px-4 relative overflow-hidden">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              Parabrisas Frontal de la Minivan
            </span>
            <span className="text-[11px] font-mono font-bold text-teal-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
              {model.plate}
            </span>
          </div>
        </div>

        {/* Realistic Minivan Floor Plan (590px height) */}
        <div className="relative w-full h-[590px] bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden shadow-inner p-2">
          {/* Subtle vehicle rubber floor texture */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Render All Realistic Elements (Seats, 3 Doors, Driver, Luggage) */}
          {freeformItems.map((item) => {
            // Driver Steering Wheel
            if (item.type === 'driver') {
              return (
                <div
                  key={item.id}
                  className="absolute flex flex-col items-center justify-center w-13 h-13 rounded-2xl bg-slate-900 border-2 border-slate-700 text-slate-300 shadow-lg -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <div className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  </div>
                  <span className="text-[8px] font-black uppercase text-slate-300">Chofer</span>
                </div>
              )
            }

            // Doors: 3 Distinct Door Types
            if (item.type === 'door') {
              // 1. Sliding Door (Puerta Corrediza lateral de pasajeros)
              if (item.doorType === 'sliding') {
                return (
                  <div
                    key={item.id}
                    className="absolute flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-teal-950/80 border-2 border-dashed border-teal-400 text-teal-300 shadow-xl shadow-teal-500/10 -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                    <DoorOpen className="w-5 h-5 text-teal-300 mb-0.5 animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-wider text-teal-300">Corrediza</span>
                    <span className="text-[7px] text-teal-400">Subida</span>
                  </div>
                )
              }

              // 2. Front Right Door (Puerta Copiloto)
              if (item.doorType === 'front_right') {
                return (
                  <div
                    key={item.id}
                    className="absolute flex flex-col items-center justify-center w-12 h-11 rounded-xl bg-slate-900 border border-teal-500/50 text-teal-400 shadow -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    title="Puerta del Copiloto (Batiente)"
                  >
                    <span className="text-[7px] font-bold text-teal-300 uppercase">Puerta</span>
                    <span className="text-[6px] text-slate-400">Copiloto</span>
                  </div>
                )
              }

              // 3. Front Left Door (Puerta Chofer)
              if (item.doorType === 'front_left') {
                return (
                  <div
                    key={item.id}
                    className="absolute flex flex-col items-center justify-center w-12 h-11 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 shadow -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    title="Puerta del Chofer"
                  >
                    <span className="text-[7px] font-bold text-slate-300 uppercase">Puerta</span>
                    <span className="text-[6px] text-slate-400">Chofer</span>
                  </div>
                )
              }

              // 4. Rear Luggage Door (Portón Posterior)
              return (
                <div
                  key={item.id}
                  className="absolute flex items-center justify-center w-28 h-7 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-[8px] font-semibold gap-1 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <Luggage className="w-3 h-3 text-teal-400" />
                  <span>Portón Trasero / Bodega</span>
                </div>
              )
            }

            if (item.type === 'luggage') {
              return (
                <div
                  key={item.id}
                  className="absolute flex items-center justify-center w-16 h-10 rounded-xl bg-amber-950/40 border border-amber-700/50 text-amber-300 text-[8px] font-bold gap-1 -translate-x-1/2 -translate-y-1/2 shadow"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <Luggage className="w-3 h-3" />
                  <span>Maletero</span>
                </div>
              )
            }

            // It's a Seat!
            const seat = seats.find(s => s.number === item.seatNumber) || 
                         seats.find(s => s.id === item.seatNumber)

            if (!seat) return null

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSeatClick(seat)}
                className={`absolute w-13 h-13 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 -translate-x-1/2 -translate-y-1/2 ${getSeatColor(seat)}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                title={`${seat.label} - S/. ${seat.price.toFixed(2)}`}
              >
                <Armchair className="w-4 h-4 mb-0.5" />
                <span className="text-xs font-black tracking-tight font-mono">
                  #{seat.number.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] font-bold opacity-90 truncate max-w-[48px]">
                  {seat.status === 'available'
                    ? `S/.${seat.price}`
                    : seat.status === 'sold_window'
                    ? 'Ventanilla'
                    : seat.status === 'sold_app'
                    ? 'Vendido'
                    : 'Bloqueado'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Real-time Aforo and Legend */}
        <div className="w-full mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs mb-3 font-semibold">
            <span className="text-slate-400">Control de Aforo:</span>
            <span className="text-teal-400 font-bold bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800">
              {occupiedCount} / {total} Asientos Ocupados ({availableCount} Libres)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-4 h-4 rounded-md bg-slate-800 border-2 border-emerald-500/70 inline-block shrink-0"></span>
              <span>Disponible</span>
            </div>

            <div className="flex items-center gap-2 text-teal-300 font-medium">
              <span className="w-4 h-4 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 inline-block shrink-0"></span>
              <span>Tu Asiento</span>
            </div>

            <div className="flex items-center gap-2 text-rose-300 font-medium">
              <span className="w-4 h-4 rounded-md bg-rose-950 border-2 border-rose-500 inline-block shrink-0"></span>
              <span>Ventanilla</span>
            </div>

            <div className="flex items-center gap-2 text-indigo-300 font-medium">
              <span className="w-4 h-4 rounded-md bg-indigo-950 border-2 border-indigo-500 inline-block shrink-0"></span>
              <span>Vendido App</span>
            </div>
          </div>

          {isDriverView && (
            <p className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-teal-300/90 text-center font-medium">
              💡 <strong>Panel Chofer:</strong> Toca un asiento libre para cobrarlo en ventanilla o uno ocupado para ver al pasajero / procesar devolución.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
