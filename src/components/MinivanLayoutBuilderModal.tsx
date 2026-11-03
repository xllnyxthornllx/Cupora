import React, { useState, useEffect, useRef } from 'react'
import { MinivanModel, FreeformLayoutItem, Trip, DoorType } from '../types'
import { saveTrips, generateInitialSeats, buildDefaultRenaultFreeform, buildDefaultSprinterFreeform, buildDefaultHiAceFreeform } from '../services/storageService'
import { X, Armchair, DoorOpen, Luggage, Save, RotateCcw, Plus, Trash2, Check, Sparkles, HelpCircle, Edit3, Wand2, MousePointer, Move, AlignJustify } from 'lucide-react'

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

  // Tools: 'select' | 'add_seat' | 'door_sliding' | 'door_copilot' | 'door_driver' | 'door_rear' | 'add_driver' | 'delete'
  const [activeTool, setActiveTool] = useState<'select' | 'add_seat' | 'door_sliding' | 'door_copilot' | 'door_driver' | 'door_rear' | 'add_driver' | 'delete'>('add_seat')
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

  // Snap magnetic coordinate function
  const snapCoordinate = (rawX: number, rawY: number) => {
    // Standard aligned lanes
    const colLanes = [22, 42, 60, 80]
    const rowLevels = [10, 26, 41, 56, 71, 86]

    let closestX = rawX
    let minDiffX = Infinity
    for (const c of colLanes) {
      const diff = Math.abs(c - rawX)
      if (diff < 8 && diff < minDiffX) {
        minDiffX = diff
        closestX = c
      }
    }

    let closestY = rawY
    let minDiffY = Infinity
    for (const r of rowLevels) {
      const diff = Math.abs(r - rawY)
      if (diff < 7 && diff < minDiffY) {
        minDiffY = diff
        closestY = r
      }
    }

    return {
      x: Math.round(Math.max(8, Math.min(92, closestX))),
      y: Math.round(Math.max(6, Math.min(94, closestY)))
    }
  }

  // Handle click on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || draggingId) return

    const rect = canvasRef.current.getBoundingClientRect()
    const rawX = ((e.clientX - rect.left) / rect.width) * 100
    const rawY = ((e.clientY - rect.top) / rect.height) * 100

    const { x, y } = snapCoordinate(rawX, rawY)

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
    } else if (activeTool === 'door_sliding') {
      const filtered = elements.filter(el => !(el.type === 'door' && el.doorType === 'sliding'))
      const newDoor: FreeformLayoutItem = {
        id: `door-sliding-${Date.now()}`,
        type: 'door',
        doorType: 'sliding',
        x: Math.round(rawX > 50 ? 94 : 6),
        y: Math.round(rawY),
        label: 'Puerta Corrediza'
      }
      setElements([...filtered, newDoor])
      setSelectedItem(newDoor)
    } else if (activeTool === 'door_copilot') {
      const filtered = elements.filter(el => !(el.type === 'door' && el.doorType === 'front_right'))
      const newDoor: FreeformLayoutItem = {
        id: `door-copilot-${Date.now()}`,
        type: 'door',
        doorType: 'front_right',
        x: 94,
        y: 10,
        label: 'Puerta Copiloto'
      }
      setElements([...filtered, newDoor])
      setSelectedItem(newDoor)
    } else if (activeTool === 'door_driver') {
      const filtered = elements.filter(el => !(el.type === 'door' && el.doorType === 'front_left'))
      const newDoor: FreeformLayoutItem = {
        id: `door-driver-${Date.now()}`,
        type: 'door',
        doorType: 'front_left',
        x: 6,
        y: 10,
        label: 'Puerta Chofer'
      }
      setElements([...filtered, newDoor])
      setSelectedItem(newDoor)
    } else if (activeTool === 'door_rear') {
      const filtered = elements.filter(el => !(el.type === 'door' && el.doorType === 'rear'))
      const newDoor: FreeformLayoutItem = {
        id: `door-rear-${Date.now()}`,
        type: 'door',
        doorType: 'rear',
        x: 50,
        y: 96,
        label: 'Portón Trasero'
      }
      setElements([...filtered, newDoor])
      setSelectedItem(newDoor)
    } else if (activeTool === 'add_driver') {
      const filtered = elements.filter(el => el.type !== 'driver')
      const newDriver: FreeformLayoutItem = {
        id: `driver-${Date.now()}`,
        type: 'driver',
        x: 22,
        y: 10,
        label: 'Chofer'
      }
      setElements([...filtered, newDriver])
      setSelectedItem(newDriver)
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

  // Dragging support with magnetic snapping
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDraggingId(id)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const rawX = ((e.clientX - rect.left) / rect.width) * 100
    const rawY = ((e.clientY - rect.top) / rect.height) * 100

    const { x, y } = snapCoordinate(rawX, rawY)

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

  // Auto Align All Seats cleanly into straight symmetric rows
  const handleAutoAlignAll = () => {
    const seats = elements.filter(el => el.type === 'seat')
    const otherItems = elements.filter(el => el.type !== 'seat')

    // Find distinct Y rows
    const sortedByY = [...seats].sort((a, b) => a.y - b.y)
    const rowBuckets: FreeformLayoutItem[][] = []

    sortedByY.forEach(s => {
      const existingBucket = rowBuckets.find(b => Math.abs(b[0].y - s.y) < 7)
      if (existingBucket) {
        existingBucket.push(s)
      } else {
        rowBuckets.push([s])
      }
    })

    // Align each bucket horizontally
    const alignedSeats: FreeformLayoutItem[] = []
    rowBuckets.forEach((bucket, bIdx) => {
      // Calculate average Y for this row
      const avgY = Math.round(bucket.reduce((acc, el) => acc + el.y, 0) / bucket.length)
      bucket.sort((a, b) => a.x - b.x)

      bucket.forEach((seat) => {
        // Snap X to clean lane
        const lanes = [19, 39, 61, 81]
        let nearestX = seat.x
        let minDiff = Infinity
        for (const l of lanes) {
          const diff = Math.abs(l - seat.x)
          if (diff < minDiff) {
            minDiff = diff
            nearestX = l
          }
        }

        alignedSeats.push({
          ...seat,
          x: nearestX,
          y: avgY
        })
      })
    })

    setElements([...otherItems, ...alignedSeats])
  }

  // Renumber seats neatly from front to back, left to right
  const handleAutoRenumber = () => {
    const seats = elements.filter(el => el.type === 'seat')
    const otherItems = elements.filter(el => el.type !== 'seat')

    const sortedSeats = [...seats].sort((a, b) => {
      if (Math.abs(a.y - b.y) > 7) {
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

  const handleSave = () => {
    const seatItems = elements.filter(el => el.type === 'seat')
    const doorItem = elements.find(el => el.type === 'door' && el.doorType === 'sliding')

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
              Personalizador de Carrocería con Alineación Inteligente
            </span>
            <h3 id="builder-title" className="text-lg font-bold text-white mt-0.5">
              Configurador de Asientos, Pasadizos y 3 Puertas
            </h3>
            <p className="text-xs text-slate-400">
              Mueve y añade asientos libremente: se alinean automáticamente en filas rectas y parejas para que todo quede ordenado y realista.
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
            <label className="block text-slate-300 font-medium mb-1">Tarifa (S/.)</label>
            <input
              type="number"
              value={defaultPrice}
              onChange={e => setDefaultPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        {/* Alignment & Templates Bar */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-teal-400 font-bold flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Plantillas Base:</span>
            </span>

            <button
              type="button"
              onClick={() => setElements(buildDefaultRenaultFreeform())}
              className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
            >
              Master 17 (3 Puertas)
            </button>

            <button
              type="button"
              onClick={() => setElements(buildDefaultSprinterFreeform())}
              className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
            >
              Sprinter 19 Larga
            </button>

            <button
              type="button"
              onClick={() => setElements(buildDefaultHiAceFreeform())}
              className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
            >
              HiAce 12
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoAlignAll}
              className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              title="Alinea todas las sillas en filas y columnas rectas uniformes"
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Auto-Alinear en Filas Rectas</span>
            </button>

            <button
              type="button"
              onClick={handleAutoRenumber}
              className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              Renumerar (1 a {totalSeatsCount})
            </button>
          </div>
        </div>

        {/* Realistic Door and Tool Selector Palette */}
        <div className="mt-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Herramientas de Colocación (Asientos, Pasadizos y las 3 Puertas):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
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
              <span className="text-[9px]">Poner Asiento</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('door_sliding')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'door_sliding'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <DoorOpen className="w-4 h-4 text-teal-300" />
              <span className="text-[9px]">Puerta Corrediza</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('door_copilot')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'door_copilot'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <DoorOpen className="w-4 h-4 text-sky-400" />
              <span className="text-[9px]">Puerta Copiloto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('door_driver')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'door_driver'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <DoorOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px]">Puerta Chofer</span>
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
              <span className="text-[9px]">Mover Chofer</span>
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
              <span className="text-[9px]">Arrastrar Sillas</span>
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
              <span className="text-[9px]">Borrar Elemento</span>
            </button>
          </div>
        </div>

        {/* Canvas Blueprint with Magnetic Visual Row Guides */}
        <div className="mt-5 p-4 bg-slate-950 rounded-3xl border-2 border-slate-800 relative">
          <div className="text-center pb-2 mb-2 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Frente (Parabrisas)</span>
            <div className="flex items-center gap-3">
              <span className="text-teal-400 font-mono">Total Asientos: {totalSeatsCount}</span>
              <span className="text-emerald-400 text-[10px]">Alineación Magnética Activa</span>
            </div>
          </div>

          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative w-full h-[590px] max-w-md mx-auto bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 overflow-hidden cursor-crosshair select-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Horizontal Row Guide Marks (Fila 1, 2, 3...) */}
            {[10, 26, 41, 56, 71, 86].map((rowY, idx) => (
              <div
                key={rowY}
                className="absolute inset-x-0 h-px border-t border-dashed border-slate-800/60 pointer-events-none flex justify-between px-2"
                style={{ top: `${rowY}%` }}
              >
                <span className="text-[7px] text-slate-700 font-mono -mt-2">
                  {idx === 0 ? 'Cabina' : `Fila ${idx}`}
                </span>
                <span className="text-[7px] text-slate-700 font-mono -mt-2">
                  {idx === 0 ? 'Cabina' : `Fila ${idx}`}
                </span>
              </div>
            ))}

            {/* Render All Elements */}
            {elements.map(item => {
              const isSelected = selectedItem?.id === item.id

              if (item.type === 'driver') {
                return (
                  <div
                    key={item.id}
                    onClick={e => handleElementClick(e, item)}
                    onMouseDown={e => handleMouseDown(e, item.id)}
                    className={`absolute flex flex-col items-center justify-center w-13 h-13 rounded-2xl bg-slate-900 border-2 text-slate-300 shadow-xl cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 ${
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
                const isSliding = item.doorType === 'sliding'
                const isCopilot = item.doorType === 'front_right'
                const isDriverDoor = item.doorType === 'front_left'

                return (
                  <div
                    key={item.id}
                    onClick={e => handleElementClick(e, item)}
                    onMouseDown={e => handleMouseDown(e, item.id)}
                    className={`absolute flex flex-col items-center justify-center rounded-2xl border-2 text-teal-300 shadow-xl cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 z-10 ${
                      isSliding
                        ? 'w-14 h-14 bg-teal-950/80 border-dashed border-teal-400'
                        : 'w-12 h-11 bg-slate-900 border-teal-500/60'
                    } ${isSelected ? 'ring-2 ring-white' : ''}`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                    <DoorOpen className="w-4 h-4 text-teal-300 mb-0.5" />
                    <span className="text-[7px] font-black uppercase text-teal-300">
                      {isSliding ? 'Corrediza' : isCopilot ? 'Copiloto' : isDriverDoor ? 'Chofer' : 'Portón'}
                    </span>
                  </div>
                )
              }

              if (item.type === 'luggage') {
                return (
                  <div
                    key={item.id}
                    onClick={e => handleElementClick(e, item)}
                    onMouseDown={e => handleMouseDown(e, item.id)}
                    className={`absolute flex items-center justify-center w-16 h-10 rounded-xl bg-amber-950/40 border text-amber-300 text-[8px] font-bold gap-1 cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 ${
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
                  className={`absolute w-13 h-13 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all -translate-x-1/2 -translate-y-1/2 ${
                    isSelected
                      ? 'bg-gradient-to-br from-teal-400 to-emerald-600 text-white border-2 border-white shadow-xl shadow-teal-500/40 ring-2 ring-teal-300 z-20 scale-105'
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
