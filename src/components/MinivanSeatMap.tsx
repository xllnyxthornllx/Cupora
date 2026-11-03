import React from 'react'
import { Seat, MinivanModel } from '../types'
import { User, Check, Clock, Armchair, ShieldCheck, Store, Ban } from 'lucide-react'

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
      return 'bg-gradient-to-br from-teal-400 to-emerald-600 text-white shadow-lg shadow-teal-500/40 ring-2 ring-white scale-105'
    }

    switch (seat.status) {
      case 'available':
        return isDriverView
          ? 'bg-slate-800/80 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white cursor-pointer hover:bg-slate-700/80'
          : 'bg-slate-800/90 border border-emerald-500/40 hover:border-emerald-400 text-slate-200 hover:text-white cursor-pointer hover:bg-slate-700/90 shadow-sm'
      case 'locked':
        return 'bg-amber-950/70 border border-amber-500/50 text-amber-300 cursor-not-allowed opacity-90'
      case 'sold_app':
        return 'bg-indigo-950/80 border border-indigo-500/60 text-indigo-300 cursor-pointer shadow-sm'
      case 'sold_window':
        return 'bg-rose-950/80 border border-rose-500/60 text-rose-300 cursor-pointer shadow-sm'
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

  // Count statistics
  const total = seats.length
  const availableCount = seats.filter(s => s.status === 'available').length
  const occupiedCount = total - availableCount

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Minivan Vehicle Frame Container */}
      <div className="w-full bg-slate-900/90 rounded-3xl p-5 border-2 border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Roof ambient highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

        {/* Minivan Windshield & Front Header */}
        <div className="relative mb-6 pb-4 border-b border-slate-800/80">
          <div className="h-9 w-full bg-slate-950/80 rounded-t-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Parabrisas Frontal
            </span>
            <div className="absolute top-1 left-4 w-12 h-1 bg-slate-700/40 rounded-full"></div>
            <div className="absolute top-1 right-4 w-12 h-1 bg-slate-700/40 rounded-full"></div>
          </div>

          {/* Cabin: Driver Area & Copilot Area */}
          <div className="grid grid-cols-4 gap-2.5 mt-3 pt-2">
            {/* Driver Seat (Always Position Col 0) */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/90 border border-slate-700/70 text-slate-400 select-none shadow-inner">
              <div className="relative">
                <div className="w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center mb-0.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                </div>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Chofer</span>
            </div>

            {/* Middle space in cabin */}
            <div className="flex items-center justify-center text-[11px] text-slate-600 font-mono">
              {/* Space */}
            </div>

            {/* Front Copilot Seat(s) */}
            {model.totalSeats >= 14 ? (
              <>
                {/* Copilot 1 */}
                {seats.find(s => s.id === 1) && (
                  <button
                    type="button"
                    onClick={() => handleSeatClick(seats.find(s => s.id === 1)!)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative ${getSeatColor(seats.find(s => s.id === 1)!)}`}
                  >
                    <Armchair className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-bold">01</span>
                    <span className="text-[9px] opacity-75">Copiloto</span>
                  </button>
                )}
                {/* Copilot 2 */}
                {seats.find(s => s.id === 2) ? (
                  <button
                    type="button"
                    onClick={() => handleSeatClick(seats.find(s => s.id === 2)!)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative ${getSeatColor(seats.find(s => s.id === 2)!)}`}
                  >
                    <Armchair className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-bold">02</span>
                    <span className="text-[9px] opacity-75">Copiloto</span>
                  </button>
                ) : (
                  <div />
                )}
              </>
            ) : (
              <>
                <div />
                {seats.find(s => s.id === 1) && (
                  <button
                    type="button"
                    onClick={() => handleSeatClick(seats.find(s => s.id === 1)!)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative ${getSeatColor(seats.find(s => s.id === 1)!)}`}
                  >
                    <Armchair className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-bold">01</span>
                    <span className="text-[9px] opacity-75">Copiloto</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sliding Door Indicator (Right side of Peruvian minivans) */}
        <div className="flex justify-between items-center px-2 py-1 mb-3 text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
          <span>Lado Izquierdo (Carretera)</span>
          <span className="text-teal-400/90 flex items-center gap-1 bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-800/40">
            🚪 Puerta Corrediza (Subida)
          </span>
        </div>

        {/* Passenger Cabin Seating Grid */}
        <div className="space-y-2.5">
          {/* Group seats by rows */}
          {[1, 2, 3, 4].map(rowIndex => {
            const rowSeats = seats.filter(s => s.row === rowIndex)
            if (rowSeats.length === 0) return null

            const isBackRow = rowIndex === 4

            return (
              <div
                key={rowIndex}
                className={`grid ${isBackRow ? 'grid-cols-4' : 'grid-cols-4'} gap-2`}
              >
                {/* For back row: 4 seats together */}
                {isBackRow ? (
                  rowSeats.map(seat => (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 relative ${getSeatColor(seat)}`}
                      title={`${seat.label} - S/. ${seat.price.toFixed(2)}`}
                    >
                      <Armchair className="w-4 h-4 mb-0.5" />
                      <span className="text-xs font-bold">{seat.number.toString().padStart(2, '0')}</span>
                      <span className="text-[8px] opacity-80 truncate max-w-full">
                        {seat.status === 'available' ? `S/.${seat.price}` : seat.status === 'sold_window' ? 'Venta' : 'Ocup'}
                      </span>
                    </button>
                  ))
                ) : (
                  // Normal rows: Left 2 seats, aisle, Right 1 seat
                  <>
                    {/* Left seats (cols 0 and 1) */}
                    {rowSeats.filter(s => s.col <= 1).map(seat => (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 relative ${getSeatColor(seat)}`}
                        title={`${seat.label} - S/. ${seat.price.toFixed(2)}`}
                      >
                        <Armchair className="w-4 h-4 mb-0.5" />
                        <span className="text-xs font-bold">{seat.number.toString().padStart(2, '0')}</span>
                        <span className="text-[8px] opacity-80 truncate max-w-full">
                          {seat.status === 'available' ? `S/.${seat.price}` : seat.status === 'sold_window' ? 'Venta' : 'Ocup'}
                        </span>
                      </button>
                    ))}

                    {/* Central Aisle */}
                    <div className="flex items-center justify-center text-[10px] text-slate-700 font-mono select-none">
                      <span className="opacity-40">| |</span>
                    </div>

                    {/* Right seat (col 3) */}
                    {rowSeats.filter(s => s.col >= 2).map(seat => (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 relative ${getSeatColor(seat)}`}
                        title={`${seat.label} - S/. ${seat.price.toFixed(2)}`}
                      >
                        <Armchair className="w-4 h-4 mb-0.5" />
                        <span className="text-xs font-bold">{seat.number.toString().padStart(2, '0')}</span>
                        <span className="text-[8px] opacity-80 truncate max-w-full">
                          {seat.status === 'available' ? `S/.${seat.price}` : seat.status === 'sold_window' ? 'Venta' : 'Ocup'}
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Trunk / Luggage Space at rear */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <span>🧳 Maletero / Bodega de Equipaje Posterior</span>
        </div>
      </div>

      {/* Legend & Aforo Indicator */}
      <div className="w-full mt-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center justify-between text-xs mb-2.5 font-medium">
          <span className="text-slate-400">Control de Aforo:</span>
          <span className="text-teal-400 font-bold">
            {occupiedCount} / {total} Asientos Ocupados ({availableCount} Libres)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-emerald-500/60 inline-block"></span>
            <span>Disponible</span>
          </div>

          <div className="flex items-center gap-1.5 text-teal-300">
            <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 inline-block"></span>
            <span>Tu Selección</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-300">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-950 border border-rose-500 inline-block"></span>
            <span>Ventanilla</span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-300">
            <span className="w-3.5 h-3.5 rounded-md bg-indigo-950 border border-indigo-500 inline-block"></span>
            <span>Venta App</span>
          </div>
        </div>

        {isDriverView && (
          <p className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-teal-300/80 text-center">
            💡 <strong>Modo Conductor:</strong> Toca cualquier asiento libre para venderlo en efectivo por ventanilla, o toca uno ocupado para ver su manifiesto.
          </p>
        )}
      </div>
    </div>
  )
}
