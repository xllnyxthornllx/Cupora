import React from 'react'
import { Seat, MinivanModel, LayoutCell } from '../types'
import { Armchair, Store, ShieldCheck, DoorOpen, Luggage, Footprints } from 'lucide-react'

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
      return 'bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/50 ring-2 ring-white scale-105 z-10'
    }

    switch (seat.status) {
      case 'available':
        return isDriverView
          ? 'bg-slate-800/95 border-2 border-slate-700 hover:border-emerald-500 text-slate-100 hover:text-white cursor-pointer hover:bg-slate-700 active:scale-95 shadow-md'
          : 'bg-slate-800/95 border-2 border-emerald-500/60 hover:border-emerald-400 text-white hover:text-white cursor-pointer hover:bg-slate-700 active:scale-95 shadow-md shadow-emerald-500/10'
      case 'locked':
        return 'bg-amber-950/90 border-2 border-amber-500/70 text-amber-300 cursor-not-allowed opacity-90'
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

  // Count statistics
  const total = seats.length
  const availableCount = seats.filter(s => s.status === 'available').length
  const occupiedCount = total - availableCount

  // Extract layout grid
  const grid = model.layoutGrid || []
  const maxRow = grid.length > 0 ? Math.max(...grid.map(c => c.row)) : (model.rows - 1)
  const maxCol = grid.length > 0 ? Math.max(...grid.map(c => c.col)) : (model.cols - 1)

  const doorCell = grid.find(c => c.type === 'door')
  const doorLocation = doorCell ? `Fila ${doorCell.row + 1} (${doorCell.col >= 2 ? 'Lado Derecho' : 'Lado Izquierdo'})` : 'Lado Derecho'

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Minivan Vehicle Frame Container */}
      <div className="w-full bg-slate-900/95 rounded-3xl p-4 sm:p-6 border-2 border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Roof ambient highlight */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-teal-500/70 to-transparent"></div>

        {/* Minivan Windshield & Front Header */}
        <div className="relative mb-5 pb-3 border-b border-slate-800">
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

        {/* Orientation / Door banner */}
        <div className="flex justify-between items-center px-1 mb-3 text-[11px] font-medium text-slate-400">
          <span className="text-slate-500 flex items-center gap-1">
            <span>Volante Chofer</span>
          </span>
          <span className="text-teal-300 flex items-center gap-1.5 bg-teal-950/70 px-3 py-1 rounded-full border border-teal-800/80 font-semibold shadow-sm">
            <DoorOpen className="w-4 h-4 text-teal-400" />
            <span>Puerta de Entrada ({doorLocation})</span>
          </span>
        </div>

        {/* Vehicle Interior Dynamic Grid with Clear Aisles / Pasadizos */}
        <div className="space-y-3">
          {Array.from({ length: maxRow + 1 }).map((_, rIdx) => {
            const rowCells = Array.from({ length: maxCol + 1 }).map((_, cIdx) => {
              return grid.find(c => c.row === rIdx && c.col === cIdx) || {
                row: rIdx,
                col: cIdx,
                type: 'aisle' as const
              }
            })

            return (
              <div 
                key={rIdx} 
                className="grid gap-2.5"
                style={{ gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))` }}
              >
                {rowCells.map((cell, cIdx) => {
                  if (cell.type === 'driver') {
                    return (
                      <div
                        key={`driver-${rIdx}-${cIdx}`}
                        className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950 border-2 border-slate-700 text-slate-300 select-none shadow-inner min-h-[62px]"
                      >
                        <div className="w-7 h-7 rounded-full border-2 border-slate-400 flex items-center justify-center mb-0.5">
                          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tight">Chofer</span>
                      </div>
                    )
                  }

                  if (cell.type === 'door') {
                    return (
                      <div
                        key={`door-${rIdx}-${cIdx}`}
                        className="flex flex-col items-center justify-center p-2 rounded-2xl bg-teal-950/60 border-2 border-dashed border-teal-400 text-teal-200 select-none min-h-[62px] text-center shadow-inner"
                      >
                        <DoorOpen className="w-5 h-5 mb-0.5 text-teal-300 animate-bounce-light" />
                        <span className="text-[9px] font-black uppercase text-teal-300">PUERTA</span>
                        <span className="text-[8px] text-teal-400">Subida</span>
                      </div>
                    )
                  }

                  if (cell.type === 'luggage') {
                    return (
                      <div
                        key={`luggage-${rIdx}-${cIdx}`}
                        className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-400/80 select-none min-h-[62px]"
                      >
                        <Luggage className="w-4 h-4 mb-0.5 opacity-70" />
                        <span className="text-[8px] font-semibold">Maletero</span>
                      </div>
                    )
                  }

                  // Clear visible aisle / pasadizo
                  if (cell.type === 'aisle') {
                    return (
                      <div
                        key={`aisle-${rIdx}-${cIdx}`}
                        className="flex flex-col items-center justify-center min-h-[62px] rounded-xl border border-dashed border-slate-800/60 bg-slate-950/30 select-none"
                      >
                        <span className="text-[8px] text-slate-600 font-mono tracking-widest uppercase">Pasadizo</span>
                      </div>
                    )
                  }

                  // Real Seat
                  const seat = seats.find(s => s.number === cell.seatNumber) || 
                               seats.find(s => s.row === cell.row && s.col === cell.col)

                  if (!seat) {
                    return (
                      <div key={`empty-seat-${rIdx}-${cIdx}`} className="min-h-[62px] rounded-xl bg-slate-950/20 border border-slate-900" />
                    )
                  }

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 min-h-[62px] relative select-none ${getSeatColor(seat)}`}
                      title={`${seat.label} - S/. ${seat.price.toFixed(2)}`}
                    >
                      <Armchair className="w-4 h-4 mb-0.5" />
                      <span className="text-xs font-black tracking-tight font-mono">
                        #{seat.number.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[8px] font-bold opacity-90 truncate max-w-full">
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
            )
          })}
        </div>

        {/* Rear Trunk / Luggage Bar */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
          <Luggage className="w-4 h-4 text-teal-400" />
          <span>Maletero Posterior & Bodega de Equipaje</span>
        </div>
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
            💡 <strong>Panel Chofer:</strong> Toca un asiento libre para venderlo en ventanilla o uno ocupado para ver al pasajero / procesar devolución.
          </p>
        )}
      </div>
    </div>
  )
}
