import React, { useState, useEffect } from 'react'
import { Seat, MinivanModel, FreeformLayoutItem, SeatScale } from '../types'
import { Armchair, DoorOpen, Luggage, Maximize2, Sliders } from 'lucide-react'

interface MinivanSeatMapProps {
  seats: Seat[]
  selectedSeatId?: number | null
  onSelectSeat?: (seat: Seat) => void
  isDriverView?: boolean
  onDriverSeatAction?: (seat: Seat) => void
  model: MinivanModel
}

// Visual dimensions specification for each scale option
const SCALE_CONFIG = {
  sm: {
    containerHeight: 'h-[580px]',
    seatSize: 'w-12 h-12', // 48px
    seatRadius: 'rounded-xl',
    iconSize: 'w-3.5 h-3.5',
    seatText: 'text-[11px]',
    priceText: 'text-[8px]',
    driverSize: 'w-12 h-12',
    driverWheel: 'w-5 h-5',
    doorSliding: 'w-13 h-13',
    doorCab: 'w-11 h-10',
    doorRear: 'w-24 h-6',
    luggage: 'w-14 h-9'
  },
  md: {
    containerHeight: 'h-[630px]',
    seatSize: 'w-14 h-14', // 56px
    seatRadius: 'rounded-2xl',
    iconSize: 'w-4 h-4',
    seatText: 'text-xs font-bold',
    priceText: 'text-[9px]',
    driverSize: 'w-14 h-14',
    driverWheel: 'w-6 h-6',
    doorSliding: 'w-15 h-15',
    doorCab: 'w-12 h-11',
    doorRear: 'w-28 h-7',
    luggage: 'w-16 h-10'
  },
  lg: { // Default / Prime Peruvian Minivan
    containerHeight: 'h-[680px]',
    seatSize: 'w-[66px] h-[66px]', // 66px spacious & prominent
    seatRadius: 'rounded-2xl',
    iconSize: 'w-5 h-5',
    seatText: 'text-sm font-black',
    priceText: 'text-[10px] font-bold',
    driverSize: 'w-[66px] h-[66px]',
    driverWheel: 'w-7 h-7',
    doorSliding: 'w-18 h-18',
    doorCab: 'w-14 h-12',
    doorRear: 'w-32 h-8',
    luggage: 'w-20 h-11'
  },
  xl: { // Extra Grande / High Accessibility
    containerHeight: 'h-[750px]',
    seatSize: 'w-[76px] h-[76px]', // 76px extra spacious
    seatRadius: 'rounded-2xl',
    iconSize: 'w-6 h-6',
    seatText: 'text-base font-black',
    priceText: 'text-xs font-bold',
    driverSize: 'w-[76px] h-[76px]',
    driverWheel: 'w-8 h-8',
    doorSliding: 'w-20 h-20',
    doorCab: 'w-16 h-14',
    doorRear: 'w-36 h-9',
    luggage: 'w-24 h-12'
  }
}

export const MinivanSeatMap: React.FC<MinivanSeatMapProps> = ({
  seats,
  selectedSeatId,
  onSelectSeat,
  isDriverView = false,
  onDriverSeatAction,
  model
}) => {
  // Configurable scale: default to 'lg' (spacious and clear)
  const [scale, setScale] = useState<SeatScale>(model.seatScale || 'lg')

  // Update scale if the model updates its scale preference
  useEffect(() => {
    if (model.seatScale) {
      setScale(model.seatScale)
    }
  }, [model.seatScale])

  const currentCfg = SCALE_CONFIG[scale]

  const getSeatColor = (seat: Seat) => {
    if (selectedSeatId === seat.id) {
      return 'bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-white shadow-xl shadow-teal-500/50 ring-4 ring-white scale-105 z-20'
    }

    switch (seat.status) {
      case 'available':
        return isDriverView
          ? 'bg-slate-800/95 border-2 border-slate-700 hover:border-emerald-400 text-white hover:text-white cursor-pointer hover:bg-slate-700 active:scale-95 shadow-md'
          : 'bg-slate-800/95 border-2 border-emerald-500/80 hover:border-emerald-300 text-white hover:text-white cursor-pointer hover:bg-slate-700 active:scale-95 shadow-lg shadow-emerald-500/10'
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
    <div className="flex flex-col items-center w-full max-w-[480px] sm:max-w-[530px] mx-auto select-none">
      {/* Interactive Size & Zoom Control Bar */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2 mb-3 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Sliders className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Tamaño de Asientos:</span>
          <span className="sm:hidden">Tamaño:</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setScale('sm')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scale === 'sm'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Tamaño Chico / Compacto"
          >
            Chico
          </button>
          <button
            type="button"
            onClick={() => setScale('md')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scale === 'md'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Tamaño Normal / Estándar"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => setScale('lg')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              scale === 'lg'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black ring-1 ring-teal-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Tamaño Grande y Cómodo (Predeterminado)"
          >
            Grande ⭐
          </button>
          <button
            type="button"
            onClick={() => setScale('xl')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scale === 'xl'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Tamaño Extra Grande"
          >
            XL
          </button>
        </div>
      </div>

      {/* Minivan Vehicle Frame Container */}
      <div className="w-full bg-slate-900/95 rounded-3xl p-3.5 sm:p-5 border-2 border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-teal-500/80 to-transparent"></div>

        {/* Front Windshield Header with Realistic Cabin Hood */}
        <div className="relative mb-3 pb-2 border-b border-slate-800">
          <div className="h-12 w-full bg-slate-950 rounded-t-2xl border border-slate-800 flex items-center justify-between px-4 relative overflow-hidden">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              Cabina y Parabrisas Frontal
            </span>
            <span className="text-xs font-mono font-bold text-teal-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {model.plate}
            </span>
          </div>
        </div>

        {/* Realistic Minivan Floor Plan with Responsive Height */}
        <div className={`relative w-full ${currentCfg.containerHeight} bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden shadow-inner p-2 transition-all duration-200`}>
          {/* Subtle vehicle rubber floor texture */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Render All Realistic Elements (Seats, 3 Doors, Driver, Luggage) */}
          {freeformItems.map((item) => {
            // Driver Steering Wheel Cabin Seat
            if (item.type === 'driver') {
              return (
                <div
                  key={item.id}
                  className={`absolute flex flex-col items-center justify-center ${currentCfg.driverSize} rounded-2xl bg-slate-900 border-2 border-slate-700 text-slate-300 shadow-xl -translate-x-1/2 -translate-y-1/2 z-10 transition-all`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <div className={`${currentCfg.driverWheel} rounded-full border-2 border-slate-400 flex items-center justify-center mb-0.5 shadow-inner`}>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-200 tracking-wider">Chofer</span>
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
                    className={`absolute flex flex-col items-center justify-center ${currentCfg.doorSliding} rounded-2xl bg-teal-950/85 border-2 border-dashed border-teal-400 text-teal-300 shadow-xl shadow-teal-500/10 -translate-x-1/2 -translate-y-1/2 z-10 transition-all`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                    <DoorOpen className={`${currentCfg.iconSize} text-teal-300 mb-0.5 animate-pulse`} />
                    <span className="text-[8px] font-black uppercase tracking-wider text-teal-300 leading-tight">Corrediza</span>
                    <span className="text-[8px] text-teal-400 font-semibold">Subida</span>
                  </div>
                )
              }

              // 2. Front Right Door (Puerta Copiloto)
              if (item.doorType === 'front_right') {
                return (
                  <div
                    key={item.id}
                    className={`absolute flex flex-col items-center justify-center ${currentCfg.doorCab} rounded-xl bg-slate-900 border border-teal-500/60 text-teal-300 shadow -translate-x-1/2 -translate-y-1/2 z-10 transition-all`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    title="Puerta del Copiloto (Batiente)"
                  >
                    <span className="text-[8px] font-black text-teal-300 uppercase leading-none">Puerta</span>
                    <span className="text-[7px] text-slate-400 font-medium mt-0.5">Copiloto</span>
                  </div>
                )
              }

              // 3. Front Left Door (Puerta Chofer)
              if (item.doorType === 'front_left') {
                return (
                  <div
                    key={item.id}
                    className={`absolute flex flex-col items-center justify-center ${currentCfg.doorCab} rounded-xl bg-slate-900 border border-slate-700 text-slate-300 shadow -translate-x-1/2 -translate-y-1/2 z-10 transition-all`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    title="Puerta del Chofer (Batiente)"
                  >
                    <span className="text-[8px] font-black text-slate-300 uppercase leading-none">Puerta</span>
                    <span className="text-[7px] text-slate-400 font-medium mt-0.5">Chofer</span>
                  </div>
                )
              }

              // 4. Rear Luggage Door (Portón Posterior)
              return (
                <div
                  key={item.id}
                  className={`absolute flex items-center justify-center ${currentCfg.doorRear} rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[9px] font-bold gap-1.5 -translate-x-1/2 -translate-y-1/2 z-10 transition-all`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <Luggage className="w-3.5 h-3.5 text-teal-400" />
                  <span>Portón Trasero / Bodega</span>
                </div>
              )
            }

            if (item.type === 'luggage') {
              return (
                <div
                  key={item.id}
                  className={`absolute flex items-center justify-center ${currentCfg.luggage} rounded-xl bg-amber-950/40 border border-amber-700/60 text-amber-300 text-[9px] font-bold gap-1 -translate-x-1/2 -translate-y-1/2 shadow transition-all`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <Luggage className="w-3.5 h-3.5" />
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
                className={`absolute ${currentCfg.seatSize} ${currentCfg.seatRadius} flex flex-col items-center justify-center transition-all duration-150 -translate-x-1/2 -translate-y-1/2 ${getSeatColor(seat)}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                title={`${seat.label} - S/. ${seat.price.toFixed(2)}`}
              >
                <Armchair className={`${currentCfg.iconSize} mb-0.5`} />
                <span className={`${currentCfg.seatText} font-mono tracking-tight leading-none`}>
                  #{seat.number.toString().padStart(2, '0')}
                </span>
                <span className={`${currentCfg.priceText} opacity-90 truncate max-w-[56px] leading-tight mt-0.5`}>
                  {seat.status === 'available'
                    ? `S/.${seat.price.toFixed(0)}`
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
            <span className="text-slate-400">Control de Aforo en Vivo:</span>
            <span className="text-teal-400 font-bold bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800">
              {occupiedCount} / {total} Asientos Ocupados ({availableCount} Libres)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-4 h-4 rounded-md bg-slate-800 border-2 border-emerald-500/80 inline-block shrink-0 shadow"></span>
              <span>Disponible</span>
            </div>

            <div className="flex items-center gap-2 text-teal-300 font-medium">
              <span className="w-4 h-4 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 inline-block shrink-0 shadow"></span>
              <span>Tu Elección</span>
            </div>

            <div className="flex items-center gap-2 text-rose-300 font-medium">
              <span className="w-4 h-4 rounded-md bg-rose-950 border-2 border-rose-500 inline-block shrink-0 shadow"></span>
              <span>Ventanilla</span>
            </div>

            <div className="flex items-center gap-2 text-indigo-300 font-medium">
              <span className="w-4 h-4 rounded-md bg-indigo-950 border-2 border-indigo-500 inline-block shrink-0 shadow"></span>
              <span>App Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
