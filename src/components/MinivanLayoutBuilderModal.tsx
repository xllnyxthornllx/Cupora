import React, { useState, useEffect, useRef } from 'react'
import { MinivanModel, FreeformLayoutItem, Trip } from '../types'
import { saveTrips, generateInitialSeats, buildDefaultRenaultFreeform, buildDefaultSprinterFreeform, buildDefaultHiAceFreeform } from '../services/storageService'
import { X, Armchair, DoorOpen, Luggage, Save, RotateCcw, Plus, Trash2, Check, Sparkles, HelpCircle, Edit3, Wand2, MousePointer, Move } from 'lucide-react'

interface MinivanLayoutBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  modelToEdit: MinivanModel
  onSaveModel: (updatedModel: MinivanModel) => void
  trips: Trip[]
  onUpdateTrips: (trips: Trip[]) => void
}

export const MinivanLayoutBuilderModal: React.FC<MinivanLayoutBuilderModalProps> = ({
  isOpen,
  onClose,
  modelToEdit,
  onSaveModel,
  trips,
  onUpdateTrips
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const [modelName, setModelName] = useState<string>(modelToEdit.name)
  const [plate, setPlate] = useState<string>(modelToEdit.plate)
  const [driverName, setDriverName] = useState<string>(modelToEdit.driverName)
  const [defaultPrice, setDefaultPrice] = useState<number>(modelToEdit.defaultPrice)
  const [elements, setElements] = useState<FreeformLayoutItem[]>([])

  // Tools: 'select' (drag/move) | 'add_seat' | 'add_door' | 'add_driver' | 'add_luggage' | 'delete'
  const [activeTool, setActiveTool] = useState<'select' | 'add_seat' | 'add_door' | 'add_driver' | 'add_luggage' | 'delete'>('add_seat')
  const [selectedItem, setSelectedItem] = useState<FreeformLayoutItem | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }
      setModelName(modelToEdit.name)
      setPlate(modelToEdit.plate)
      setDriverName(modelToEdit.driverName)
      setDefaultPrice(modelToEdit.defaultPrice)

      if (modelToEdit.freeformElements && modelToEdit.freeformElements.length > 0) {
        setElements([...modelToEdit.freeformElements])
      } else {
        setElements(buildDefaultRenaultFreeform())
      }
      setSelectedItem(null)
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen, modelToEdit])

  if (!isOpen) return null

  // Handle click on canvas to place element
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || draggingId) return

    const rect = canvasRef.current.getBoundingClientRect()
    const rawX = ((e.clientX - rect.left) / rect.width) * 100
    const rawY = ((e.clientY - rect.top) / rect.height) * 100

    // Clamp between 8% and 92%
    const x = Math.round(Math.max(8, Math.min(92, rawX)))
    const y = Math.round(Math.max(6, Math.min(94, rawY)))

    if (activeTool === 'add_seat') {
      const currentSeats = elements.filter(el => el.type === 'seat')
      const nextSeatNum = currentSeats.length + 1
      const newSeat: FreeformLayoutItem = {
        id: `seat-${Date.now()}`,
        type: 'seat',
        x,
        y,
        seatNumber: nextSeatNum,
        label: `Asiento ${nextSeatNum.toString().padStart(2, '0')}`,
        price: defaultPrice
      }
      setElements(prev => [...prev, newSeat])
      setSelectedItem(newSeat)
    } else if (activeTool === 'add_door') {
      const filtered = elements.filter(el => el.type !== 'door')
      const newDoor: FreeformLayoutItem = {
        id: `door-${Date.now()}`,
        type: 'door',
        x,
        y,
        label: 'Puerta de Subida'
      }
      setElements([...filtered, newDoor])
      setSelectedItem(newDoor)
    } else if (activeTool === 'add_driver') {
      const filtered = elements.filter(el => el.type !== 'driver')
      const newDriver: FreeformLayoutItem = {
        id: `driver-${Date.now()}`,
        type: 'driver',
        x,
        y,
        label: 'Chofer'
      }
      setElements([...filtered, newDriver])
      setSelectedItem(newDriver)
    } else if (activeTool === 'add_luggage') {
      const newLuggage: FreeformLayoutItem = {
        id: `luggage-${Date.now()}`,
        type: 'luggage',
        x,
        y,
        label: 'Maletero'
      }
      setElements(prev => [...prev, newLuggage])
      setSelectedItem(newLuggage)
    }
  }

  // Handle element click / selection / delete
  const handleElementClick = (e: React.MouseEvent, item: FreeformLayoutItem) => {
    e.stopPropagation()
    if (activeTool === 'delete') {
      setElements(prev => prev.filter(el => el.id !== item.id))
      if (selectedItem?.id === item.id) setSelectedItem(null)
    } else {
      setSelectedItem(item)
    }
  }

  // Dragging support
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDraggingId(id)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const rawX = ((e.clientX - rect.left) / rect.width) * 100
    const rawY = ((e.clientY - rect.top) / rect.height) * 100

    const x = Math.round(Math.max(6, Math.min(94, rawX)))
    const y = Math.round(Math.max(5, Math.min(95, rawY)))

    setElements(prev => prev.map(el => {
      if (el.id === draggingId) {
        return { ...el, x, y }
      }
      return el
    }))
  }

  const handleMouseUp = () => {
    setDraggingId(null)
  }

  // Renumber seats neatly from front (low y) to back (high y), left to right
  const handleAutoRenumber = () => {
    const seats = elements.filter(el => el.type === 'seat')
    const otherItems = elements.filter(el => el.type !== 'seat')

    // Sort by y, then by x
    const sortedSeats = [...seats].sort((a, b) => {
      if (Math.abs(a.y - b.y) > 6) {
        return a.y - b.y
      }
      return a.x - b.x
    })

    const renumbered = sortedSeats.map((s, idx) => {
      const num = idx + 1
      return {
        ...s,
        seatNumber: num,
        label: num <= 2 ? `0${num} Copiloto` : `${num.toString().padStart(2, '0')} Asiento`
      }
    })

    setElements([...otherItems, ...renumbered])
  }

  // Clear floor completely
  const handleClearAll = () => {
    if (window.confirm('¿Deseas vaciar todo el piso de la minivan para colocar asientos desde cero?')) {
      setElements([
        { id: 'drv-01', type: 'driver', x: 22, y: 10, label: 'Chofer' },
        { id: 'door-01', type: 'door', x: 88, y: 26, label: 'Puerta de Subida' }
      ])
      setSelectedItem(null)
    }
  }

  const handleSave = () => {
    const seatItems = elements.filter(el => el.type === 'seat')
    const doorItem = elements.find(el => el.type === 'door')

    const updatedModel: MinivanModel = {
      ...modelToEdit,
      name: modelName.trim(),
      plate: plate.trim().toUpperCase(),
      driverName: driverName.trim(),
      defaultPrice,
      totalSeats: seatItems.length,
      doorRow: doorItem ? Math.round((doorItem.y / 100) * 6) : 1,
      doorCol: doorItem ? (doorItem.x > 50 ? 3 : 0) : 3,
      freeformElements: elements
    }

    onSaveModel(updatedModel)

    const updatedTrips = trips.map(t => {
      if (t.modelId === updatedModel.id) {
        return {
          ...t,
          driverName: updatedModel.driverName,
          plate: updatedModel.plate,
          seats: generateInitialSeats(updatedModel, updatedModel.defaultPrice)
        }
      }
      return t
    })

    saveTrips(updatedTrips)
    onUpdateTrips(updatedTrips)
    onClose()
  }

  const totalSeatsCount = elements.filter(el => el.type === 'seat').length

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="p-0 bg-transparent max-w-4xl w-full rounded-3xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-md shadow-2xl m-auto"
      aria-labelledby="builder-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden text-slate-100 shadow-2xl p-5 sm:p-6 relative max-h-[94dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Diseñador Libre de Carrocería & Pasadizos
            </span>
            <h3 id="builder-title" className="text-lg font-bold text-white mt-0.5">
              Lienzo Libre de Asientos y Puerta
            </h3>
            <p className="text-xs text-slate-400">
              Toca o arrastra cualquier silla donde quieras. El espacio vacío entre asientos es automáticamente el pasadizo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="col-span-2">
            <label className="block text-slate-300 font-medium mb-1">Nombre / Modelo de Minivan</label>
            <input
              type="text"
              value={modelName}
              onChange={e => setModelName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Placa Oficial</label>
            <input
              type="text"
              value={plate}
              onChange={e => setPlate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Tarifa por Asiento (S/.)</label>
            <input
              type="number"
              value={defaultPrice}
              onChange={e => setDefaultPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-teal-400 font-bold flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Plantillas Rápidas:</span>
            </span>

            <button
              type="button"
              onClick={() => setElements(buildDefaultRenaultFreeform())}
              className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
            >
              Renault Master (17 Asientos)
            </button>

            <button
              type="button"
              onClick={() => setElements(buildDefaultSprinterFreeform())}
              className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
            >
              Sprinter Larga (19 Asientos)
            </button>

            <button
              type="button"
              onClick={() => setElements(buildDefaultHiAceFreeform())}
              className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
            >
              Toyota HiAce (12 Asientos)
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="py-1 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-bold"
            >
              Vaciar Piso (Colocar a Mano)
            </button>
          </div>

          <button
            type="button"
            onClick={handleAutoRenumber}
            className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            Renumerar Asientos (1 al {totalSeatsCount})
          </button>
        </div>

        {/* Action Tools Palette */}
        <div className="mt-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Herramientas: Haz clic en una herramienta y luego toca el piso del auto:
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTool('add_seat')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'add_seat'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Armchair className="w-4 h-4 text-teal-400" />
              <span className="text-[10px]">Tocar = Poner Silla</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('add_door')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'add_door'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <DoorOpen className="w-4 h-4 text-teal-400" />
              <span className="text-[10px]">Tocar = Poner Puerta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('add_driver')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'add_driver'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
              <span className="text-[10px]">Mover Chofer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('add_luggage')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'add_luggage'
                  ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Luggage className="w-4 h-4 text-amber-400" />
              <span className="text-[10px]">Poner Maletero</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('select')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'select'
                  ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-bold ring-1 ring-indigo-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Move className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px]">Arrastrar Sillas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('delete')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'delete'
                  ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold ring-1 ring-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span className="text-[10px]">Tocar = Borrar</span>
            </button>
          </div>
        </div>

        {/* Selected Item Editor Drawer */}
        {selectedItem && (
          <div className="mt-3 p-3 bg-slate-950 rounded-2xl border border-teal-500/40 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="text-teal-300 font-bold">
                Elemento Seleccionado: {selectedItem.type.toUpperCase()}
              </span>

              {selectedItem.type === 'seat' && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">N° Asiento:</span>
                  <input
                    type="number"
                    value={selectedItem.seatNumber || 1}
                    onChange={e => {
                      const val = Number(e.target.value)
                      setElements(prev => prev.map(el => el.id === selectedItem.id ? { ...el, seatNumber: val, label: `Asiento ${val.toString().padStart(2, '0')}` } : el))
                      setSelectedItem({ ...selectedItem, seatNumber: val })
                    }}
                    className="w-16 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white font-mono"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setElements(prev => prev.filter(el => el.id !== selectedItem.id))
                setSelectedItem(null)
              }}
              className="py-1 px-3 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 text-xs font-bold"
            >
              Eliminar
            </button>
          </div>
        )}

        {/* Freeform Interactive Vehicle Floor Blueprint */}
        <div className="mt-5 p-4 bg-slate-950 rounded-3xl border-2 border-slate-800 relative">
          <div className="text-center pb-2 mb-2 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Frente del Vehículo (Parabrisas)</span>
            <span className="text-teal-400 font-mono">Total Asientos: {totalSeatsCount}</span>
          </div>

          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative w-full h-[580px] max-w-md mx-auto bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 overflow-hidden cursor-crosshair select-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Guide overlay */}
            <div className="absolute top-2 inset-x-0 text-center pointer-events-none">
              <span className="text-[10px] text-slate-600 font-mono">
                Piso Libre de la Minivan • Haz clic o arrastra para posicionar sillas y puertas
              </span>
            </div>

            {/* Render Draggable / Freeform Elements */}
            {elements.map(item => {
              const isSelected = selectedItem?.id === item.id

              if (item.type === 'driver') {
                return (
                  <div
                    key={item.id}
                    onClick={e => handleElementClick(e, item)}
                    onMouseDown={e => handleMouseDown(e, item.id)}
                    className={`absolute flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border-2 text-slate-300 shadow-xl cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 ${
                      isSelected ? 'border-teal-400 ring-2 ring-teal-400' : 'border-slate-600'
                    }`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                    <div className="w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    </div>
                    <span className="text-[8px] font-bold uppercase text-slate-300">Chofer</span>
                  </div>
                )
              }

              if (item.type === 'door') {
                return (
                  <div
                    key={item.id}
                    onClick={e => handleElementClick(e, item)}
                    onMouseDown={e => handleMouseDown(e, item.id)}
                    className={`absolute flex flex-col items-center justify-center w-16 h-14 rounded-2xl bg-teal-950/80 border-2 border-dashed text-teal-300 shadow-xl cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 z-10 ${
                      isSelected ? 'border-white ring-2 ring-teal-400' : 'border-teal-400'
                    }`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                    <DoorOpen className="w-5 h-5 text-teal-300 mb-0.5" />
                    <span className="text-[8px] font-black uppercase text-teal-300">Puerta</span>
                    <span className="text-[7px] text-teal-400">Subida</span>
                  </div>
                )
              }

              if (item.type === 'luggage') {
                return (
                  <div
                    key={item.id}
                    onClick={e => handleElementClick(e, item)}
                    onMouseDown={e => handleMouseDown(e, item.id)}
                    className={`absolute flex items-center justify-center w-20 h-10 rounded-xl bg-amber-950/40 border text-amber-300 text-[9px] font-bold gap-1 cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 ${
                      isSelected ? 'border-amber-300 ring-2 ring-amber-400' : 'border-amber-700/60'
                    }`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                    <Luggage className="w-3.5 h-3.5" />
                    <span>Maletero</span>
                  </div>
                )
              }

              // Seat
              return (
                <div
                  key={item.id}
                  onClick={e => handleElementClick(e, item)}
                  onMouseDown={e => handleMouseDown(e, item.id)}
                  className={`absolute w-14 h-14 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-shadow -translate-x-1/2 -translate-y-1/2 ${
                    isSelected
                      ? 'bg-gradient-to-br from-teal-400 to-emerald-600 text-white border-2 border-white shadow-xl shadow-teal-500/40 ring-2 ring-teal-300 z-20'
                      : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-2 border-teal-500/70 shadow-md'
                  }`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <Armchair className="w-4 h-4 mb-0.5" />
                  <span className="font-mono font-black text-xs text-white">
                    #{item.seatNumber?.toString().padStart(2, '0') || '01'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="text-center pt-3 mt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Fondo Posterior (Maletero y Parte Trasera)
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-500/30 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Distribución de Minivan</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
