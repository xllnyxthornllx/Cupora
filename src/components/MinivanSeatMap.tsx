import React, { useState, useEffect } from 'react'
import { Seat, MinivanModel, FreeformLayoutItem, SeatScale } from '../types'
import { Armchair, DoorOpen, Luggage, LayoutGrid, Bus, Sliders, Check } from 'lucide-react'

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
  const [scale, setScale] = useState<SeatScale>(model.seatScale || 'lg')
  const [viewMode, setViewMode] = useState<'blueprint' | 'grid'>('blueprint')

  useEffect(() => {
    if (model.seatScale) {
      setScale(model.seatScale)
    }
  }, [model.seatScale])

  // Scale multiplier for fluid container query units
  const scaleMultipliers: Record<SeatScale, number> = {
    sm: 0.88,
    md: 1.0,
    lg: 1.14,
    xl: 1.28
  }
  const mult = scaleMultipliers[scale]

  const getSeatColor = (seat: Seat) => {
    if (selectedSeatId === seat.id) {
      return 'bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-white shadow-xl shadow-teal-500/50 ring-2 sm:ring-4 ring-white scale-105 z-20'
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
    <div className="flex flex-col items-center w-full max-w-[390px] sm:max-w-[450px] mx-auto select-none">
      {/* Top Controller Bar: View Mode & Size Selector */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl px-2.5 sm:px-3.5 py-1.5 mb-2.5 shadow-md backdrop-blur-md gap-2">
        {/* Toggle between Proportional Blueprint and Quick Grid */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all ${
              viewMode === 'blueprint'
                ? 'bg-teal-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista de Croquis Automotriz Adaptado"
          >
            <Bus className="w-3 h-3" />
            <span>Croquis</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all ${
              viewMode === 'grid'
                ? 'bg-teal-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista de Cuadrícula Rápida"
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Lista</span>
          </button>
        </div>

        {/* Size Scale Selector */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setScale('sm')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              scale === 'sm' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            S
          </button>
          <button
            type="button"
            onClick={() => setScale('md')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              scale === 'md' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            M
          </button>
          <button
            type="button"
            onClick={() => setScale('lg')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              scale === 'lg' ? 'bg-teal-500 text-slate-950 font-black ring-1 ring-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            L ⭐
          </button>
          <button
            type="button"
            onClick={() => setScale('xl')}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              scale === 'xl' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            XL
          </button>
        </div>
      </div>

      {/* Main Vehicle Chassis Frame */}
      <div className="w-full bg-slate-900/95 rounded-2xl sm:rounded-3xl p-2 sm:p-3.5 border-2 border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-500/80 to-transparent"></div>

        {/* Front Windshield Header with Plate */}
        <div className="relative mb-2 pb-1.5 border-b border-slate-800">
          <div className="h-10 w-full bg-slate-950 rounded-t-xl border border-slate-800 flex items-center justify-between px-3 relative overflow-hidden">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Cabina y Parabrisas
            </span>
            <span className="text-[11px] font-mono font-bold text-teal-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {model.plate}
            </span>
          </div>
        </div>

        {/* VIEW 1: PROPORTIONAL AUTOMOTIVE FLUID BLUEPRINT */}
        {viewMode === 'blueprint' ? (
          <div 
            className="relative w-full aspect-[380/580] bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800/90 shadow-inner p-1 overflow-hidden transition-all [container-type:inline-size]"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            {/* Render All Elements with Container Query Units (cqi) */}
            {freeformItems.map((item) => {
              // 1. Driver Steering Wheel Cabin
              if (item.type === 'driver') {
                const driverSize = `${14.5 * mult}cqi`
                return (
                  <div
                    key={item.id}
                    className="absolute flex flex-col items-center justify-center rounded-xl bg-slate-900 border-2 border-slate-700 text-slate-300 shadow-xl -translate-x-1/2 -translate-y-1/2 z-10 transition-all"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: driverSize,
                      height: driverSize
                    }}
                  >
                    <div className="w-[4.2cqi] h-[4.2cqi] rounded-full border-2 border-slate-300 flex items-center justify-center mb-0.5">
                      <div className="w-[1.2cqi] h-[1.2cqi] rounded-full bg-slate-300"></div>
                    </div>
                    <span className="text-[2.6cqi] font-black uppercase text-slate-200 tracking-wider leading-none">Chofer</span>
                  </div>
                )
              }

              // 2. The Vehicle Doors (Corrediza, Cabina y Trasera)
              if (item.type === 'door') {
                if (item.doorType === 'rear') {
                  return (
                    <div
                      key={item.id}
                      className="absolute flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[2.5cqi] font-bold gap-1 -translate-x-1/2 -translate-y-1/2 z-10 transition-all"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: `${26 * mult}cqi`,
                        height: `${6 * mult}cqi`
                      }}
                    >
                      <Luggage className="w-[3cqi] h-[3cqi] text-teal-400 shrink-0" />
                      <span className="truncate">Portón Trasero</span>
                    </div>
                  )
                }

                // Sliding Passenger Door (Right side with step indicator)
                if (item.doorType === 'sliding') {
                  const doorSize = `${15 * mult}cqi`
                  return (
                    <div
                      key={item.id}
                      className="absolute flex flex-col items-center justify-center rounded-xl bg-teal-950/90 border-2 border-dashed border-teal-400 text-teal-300 shadow-xl shadow-teal-500/10 -translate-x-1/2 -translate-y-1/2 z-10 transition-all"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: doorSize,
                        height: doorSize
                      }}
                    >
                      <DoorOpen className="w-[3.6cqi] h-[3.6cqi] text-teal-300 mb-0.5 animate-pulse" />
                      <span className="text-[2.4cqi] font-black uppercase tracking-wider text-teal-300 leading-none">Corrediza</span>
                      <span className="text-[2.4cqi] text-teal-400 font-semibold leading-none mt-0.5">Subida</span>
                    </div>
                  )
                }

                // Front Doors (Copiloto & Chofer Swing Doors)
                const isCopilot = item.doorType === 'front_right'
                const cabDoorWidth = `${12.5 * mult}cqi`
                const cabDoorHeight = `${10 * mult}cqi`

                return (
                  <div
                    key={item.id}
                    className="absolute flex flex-col items-center justify-center rounded-lg bg-slate-900 border border-teal-500/50 text-teal-300 shadow -translate-x-1/2 -translate-y-1/2 z-10 transition-all"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: cabDoorWidth,
                      height: cabDoorHeight
                    }}
                    title={isCopilot ? 'Puerta Copiloto' : 'Puerta Chofer'}
                  >
                    <span className="text-[2.4cqi] font-black text-slate-300 uppercase leading-none">Puerta</span>
                    <span className="text-[2.2cqi] text-slate-400 font-semibold mt-0.5 leading-none">
                      {isCopilot ? 'Copiloto' : 'Chofer'}
                    </span>
                  </div>
                )
              }

              if (item.type === 'luggage') {
                return (
                  <div
                    key={item.id}
                    className="absolute flex items-center justify-center rounded-lg bg-amber-950/40 border border-amber-700/60 text-amber-300 text-[2.4cqi] font-bold gap-1 -translate-x-1/2 -translate-y-1/2 shadow"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${16 * mult}cqi`,
                      height: `${8 * mult}cqi`
                    }}
                  >
                    <Luggage className="w-[3cqi] h-[3cqi]" />
                    <span>Maletero</span>
                  </div>
                )
              }

              // 4. Passenger Seats (Fluid Proportional Scaling)
              const seat = seats.find(s => s.number === item.seatNumber) || 
                           seats.find(s => s.id === item.seatNumber)

              if (!seat) return null

              const seatDim = `${14.5 * mult}cqi`

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSeatClick(seat)}
                  className={`absolute rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-150 -translate-x-1/2 -translate-y-1/2 ${getSeatColor(seat)}`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    width: seatDim,
                    height: seatDim
                  }}
                  title={`${seat.label} - S/. ${seat.price.toFixed(2)}`}
                >
                  <div className="flex items-center justify-center gap-0.5 leading-none mb-0.5">
                    <Armchair className="w-[3.6cqi] h-[3.6cqi] shrink-0" />
                    <span className="font-mono font-black text-[3.4cqi] tracking-tight leading-none">
                      #{seat.number.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[2.5cqi] font-bold opacity-90 truncate max-w-[12cqi] leading-tight">
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
        ) : (
          /* VIEW 2: ACCESSIBLE QUICK GRID MATRIX (Ideal for small phones) */
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {seats.map(seat => {
                const isSelected = selectedSeatId === seat.id
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all text-xs border ${
                      isSelected
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold ring-2 ring-white shadow-lg'
                        : seat.status === 'available'
                        ? 'bg-slate-900 border-slate-800 hover:border-teal-500 text-white'
                        : seat.status === 'sold_window'
                        ? 'bg-rose-950/70 border-rose-800/60 text-rose-300'
                        : 'bg-indigo-950/70 border-indigo-800/60 text-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-mono font-bold text-sm">
                      <Armchair className="w-3.5 h-3.5" />
                      <span>#{seat.number.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
                      {seat.status === 'available' ? `S/. ${seat.price.toFixed(2)}` : seat.status === 'sold_window' ? 'Ventanilla' : 'Vendido'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Live Aforo Counter & Simple Legend */}
        <div className="w-full mt-3 bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 shadow">
          <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
            <span className="text-slate-400">Aforo:</span>
            <span className="text-teal-300 font-bold bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
              {occupiedCount}/{total} Ocupados ({availableCount} Libres)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
            <div className="flex items-center justify-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-emerald-500 inline-block"></span>
              <span>Libre</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-teal-300">
              <span className="w-2.5 h-2.5 rounded bg-teal-500 inline-block"></span>
              <span>Elegido</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-rose-300">
              <span className="w-2.5 h-2.5 rounded bg-rose-950 border border-rose-500 inline-block"></span>
              <span>Ventanilla</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-indigo-300">
              <span className="w-2.5 h-2.5 rounded bg-indigo-950 border border-indigo-500 inline-block"></span>
              <span>App</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
