import React, { useState, useEffect, useRef } from 'react'
import { MinivanModel, LayoutCell, CellType, Trip } from '../types'
import { saveModels, saveTrips, generateInitialSeats } from '../services/storageService'
import { X, Armchair, DoorOpen, Luggage, Save, RotateCcw, Plus, Minus, Trash2, Check, Sparkles, HelpCircle, Edit3, Grid, Layers } from 'lucide-react'

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

  const [modelName, setModelName] = useState<string>(modelToEdit.name)
  const [plate, setPlate] = useState<string>(modelToEdit.plate)
  const [driverName, setDriverName] = useState<string>(modelToEdit.driverName)
  const [defaultPrice, setDefaultPrice] = useState<number>(modelToEdit.defaultPrice)
  const [rowsCount, setRowsCount] = useState<number>(modelToEdit.rows || 6)
  const [colsCount, setColsCount] = useState<number>(modelToEdit.cols || 4)
  const [gridCells, setGridCells] = useState<LayoutCell[]>([])

  // Active Tool for manual stamping: 'seat' | 'door' | 'driver' | 'luggage' | 'aisle' | 'edit_number'
  const [activeTool, setActiveTool] = useState<CellType | 'edit_number'>('seat')
  const [selectedSeatToEdit, setSelectedSeatToEdit] = useState<{ row: number; col: number; number: number; label: string } | null>(null)

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
      setRowsCount(modelToEdit.rows || 6)
      setColsCount(modelToEdit.cols || 4)

      if (modelToEdit.layoutGrid && modelToEdit.layoutGrid.length > 0) {
        setGridCells([...modelToEdit.layoutGrid])
      } else {
        const initial: LayoutCell[] = []
        for (let r = 0; r < (modelToEdit.rows || 6); r++) {
          for (let c = 0; c < (modelToEdit.cols || 4); c++) {
            if (r === 0 && c === 0) {
              initial.push({ row: r, col: c, type: 'driver', label: 'Chofer' })
            } else if (r === 1 && c === (modelToEdit.cols || 4) - 1) {
              initial.push({ row: r, col: c, type: 'door', label: 'Puerta' })
            } else {
              initial.push({ row: r, col: c, type: 'seat', label: `Asiento` })
            }
          }
        }
        setGridCells(initial)
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen, modelToEdit])

  if (!isOpen) return null

  const getCell = (row: number, col: number): LayoutCell => {
    const existing = gridCells.find(c => c.row === row && c.col === col)
    if (existing) return existing
    return { row, col, type: 'aisle' }
  }

  // Stamp clicked cell with active tool
  const handleCellClick = (row: number, col: number) => {
    const existing = gridCells.find(c => c.row === row && c.col === col)

    if (activeTool === 'edit_number') {
      if (existing && existing.type === 'seat') {
        setSelectedSeatToEdit({
          row,
          col,
          number: existing.seatNumber || 1,
          label: existing.label || `Asiento ${existing.seatNumber || 1}`
        })
      }
      return
    }

    setGridCells(prev => {
      const filtered = prev.filter(c => !(c.row === row && c.col === col))

      if (activeTool === 'seat') {
        // Calculate next seat number
        const existingSeats = prev.filter(c => c.type === 'seat' && !(c.row === row && c.col === col))
        const nextNum = existing?.seatNumber || (existingSeats.length + 1)
        return [...filtered, {
          row,
          col,
          type: 'seat',
          seatNumber: nextNum,
          label: `Asiento ${nextNum.toString().padStart(2, '0')}`
        }]
      }

      if (activeTool === 'door') {
        return [...filtered, { row, col, type: 'door', label: 'Puerta de Subida' }]
      }

      if (activeTool === 'driver') {
        // Remove any other driver cell
        const withoutOtherDriver = filtered.filter(c => c.type !== 'driver')
        return [...withoutOtherDriver, { row, col, type: 'driver', label: 'Chofer' }]
      }

      if (activeTool === 'luggage') {
        return [...filtered, { row, col, type: 'luggage', label: 'Maletero' }]
      }

      // 'aisle' (eraser)
      return [...filtered, { row, col, type: 'aisle' }]
    })
  }

  // Save specific seat number edit
  const handleSaveSeatNumber = () => {
    if (!selectedSeatToEdit) return
    setGridCells(prev => prev.map(c => {
      if (c.row === selectedSeatToEdit.row && c.col === selectedSeatToEdit.col) {
        return {
          ...c,
          seatNumber: Number(selectedSeatToEdit.number),
          label: selectedSeatToEdit.label
        }
      }
      return c
    }))
    setSelectedSeatToEdit(null)
  }

  // Renumber all seats neatly from front to back
  const handleAutoRenumber = () => {
    let seatCounter = 1
    // Sort by row, then by col
    const sortedGrid = [...gridCells].sort((a, b) => a.row === b.row ? a.col - b.col : a.row - b.row)
    const updated = sortedGrid.map(cell => {
      if (cell.type === 'seat') {
        const num = seatCounter++
        return {
          ...cell,
          seatNumber: num,
          label: num === 1 || num === 2 ? `0${num} Copiloto` : `${num.toString().padStart(2, '0')} Asiento`
        }
      }
      return cell
    })
    setGridCells(updated)
  }

  // Clear all cells to empty aisle
  const handleClearAll = () => {
    if (window.confirm('¿Deseas vaciar todo el mapa para colocar los asientos desde cero?')) {
      const empty: LayoutCell[] = []
      for (let r = 0; r < rowsCount; r++) {
        for (let c = 0; c < colsCount; c++) {
          empty.push({ row: r, col: c, type: 'aisle' })
        }
      }
      setGridCells(empty)
    }
  }

  const handleSave = () => {
    const seatCells = gridCells.filter(c => c.type === 'seat')
    const totalSeats = seatCells.length

    let counter = 1
    const normalizedCells = gridCells.map(c => {
      if (c.type === 'seat') {
        const num = c.seatNumber ?? counter++
        return {
          ...c,
          seatNumber: num,
          label: c.label || `Asiento ${num.toString().padStart(2, '0')}`,
          price: defaultPrice
        }
      }
      return c
    })

    const doorCell = normalizedCells.find(c => c.type === 'door')

    const updatedModel: MinivanModel = {
      ...modelToEdit,
      name: modelName.trim(),
      plate: plate.trim().toUpperCase(),
      driverName: driverName.trim(),
      defaultPrice,
      rows: rowsCount,
      cols: colsCount,
      doorRow: doorCell?.row ?? 1,
      doorCol: doorCell?.col ?? (colsCount - 1),
      totalSeats,
      layoutGrid: normalizedCells
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

  const totalSeatsCount = gridCells.filter(c => c.type === 'seat').length

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="p-0 bg-transparent max-w-2xl w-full rounded-3xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-md shadow-2xl m-auto"
      aria-labelledby="builder-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden text-slate-100 shadow-2xl p-5 sm:p-6 relative max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Personalizador de Carrocería & Asientos
            </span>
            <h3 id="builder-title" className="text-lg font-bold text-white mt-0.5">
              Editor Manual Libre de Minivan
            </h3>
            <p className="text-xs text-slate-400">
              Coloca los asientos, la puerta y el volante donde corresponda en este vehículo
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

        {/* Model Details Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="col-span-2">
            <label className="block text-slate-300 font-medium mb-1">Modelo / Nombre de Minivan</label>
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

        {/* Dimensions Controls: Add/Remove Rows and Cols */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Tamaño de Cuadrícula:</span>
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px]">Filas: {rowsCount}</span>
              <button
                type="button"
                onClick={() => setRowsCount(Math.max(3, rowsCount - 1))}
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setRowsCount(Math.min(8, rowsCount + 1))}
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px]">Columnas: {colsCount}</span>
              <button
                type="button"
                onClick={() => setColsCount(Math.max(3, colsCount - 1))}
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setColsCount(Math.min(5, colsCount + 1))}
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoRenumber}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs transition-colors border border-teal-500/30"
            >
              Renumerar (1 a {totalSeatsCount})
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs transition-colors border border-slate-700"
              title="Borrar todo para armar desde cero"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Free Tool Selector Palette */}
        <div className="mt-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Selecciona una herramienta y toca las casillas de la minivan:
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTool('seat')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'seat'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md shadow-teal-500/20 ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Armchair className="w-4 h-4 text-teal-400" />
              <span className="text-[10px]">Poner Asiento</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('door')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'door'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md shadow-teal-500/20 ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <DoorOpen className="w-4 h-4 text-teal-400" />
              <span className="text-[10px]">Poner Puerta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('driver')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'driver'
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-md shadow-teal-500/20 ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
              <span className="text-[10px]">Poner Chofer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('luggage')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'luggage'
                  ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold shadow-md ring-1 ring-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Luggage className="w-4 h-4 text-amber-400" />
              <span className="text-[10px]">Maletero</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('aisle')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'aisle'
                  ? 'bg-slate-800 border-slate-500 text-white font-bold ring-1 ring-slate-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span className="text-[10px]">Borrar / Pasillo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('edit_number')}
              className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                activeTool === 'edit_number'
                  ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-bold shadow-md ring-1 ring-indigo-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px]">Editar N° Silla</span>
            </button>
          </div>
        </div>

        {/* Modal for manual seat number editing */}
        {selectedSeatToEdit && (
          <div className="mt-4 p-4 bg-indigo-950/60 border border-indigo-500/50 rounded-2xl space-y-3 animate-in fade-in text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-indigo-300">
                Editar Número de Asiento (Fila {selectedSeatToEdit.row + 1}, Columna {selectedSeatToEdit.col + 1})
              </span>
              <button
                type="button"
                onClick={() => setSelectedSeatToEdit(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Número de Asiento (Ej. 1, 2, 7, 15)</label>
                <input
                  type="number"
                  value={selectedSeatToEdit.number}
                  onChange={e => setSelectedSeatToEdit({ ...selectedSeatToEdit, number: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Etiqueta (Ej. Ventana, Pasillo, Copiloto)</label>
                <input
                  type="text"
                  value={selectedSeatToEdit.label}
                  onChange={e => setSelectedSeatToEdit({ ...selectedSeatToEdit, label: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveSeatNumber}
              className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Guardar Número
            </button>
          </div>
        )}

        {/* Minivan Graphic Layout Canvas */}
        <div className="mt-5 p-5 bg-slate-950 rounded-3xl border-2 border-slate-800 relative">
          <div className="text-center pb-3 mb-3 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Frente (Parabrisas)</span>
            <span className="text-teal-400 font-mono">Total: {totalSeatsCount} Asientos</span>
          </div>

          <div className="space-y-2.5 max-w-sm mx-auto">
            {Array.from({ length: rowsCount }).map((_, rIdx) => (
              <div
                key={rIdx}
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: colsCount }).map((_, cIdx) => {
                  const cell = getCell(rIdx, cIdx)
                  const isSeat = cell.type === 'seat'
                  const isDoor = cell.type === 'door'
                  const isDriver = cell.type === 'driver'
                  const isLuggage = cell.type === 'luggage'
                  const isAisle = cell.type === 'aisle'

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      type="button"
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      className={`h-14 rounded-2xl flex flex-col items-center justify-center p-1 transition-all border text-xs relative active:scale-95 ${
                        isSeat
                          ? 'bg-slate-800 hover:bg-slate-700 border-teal-500/70 text-teal-300 shadow-md shadow-teal-500/10'
                          : isDoor
                          ? 'bg-teal-950 border-2 border-dashed border-teal-400 text-teal-300 font-bold animate-pulse'
                          : isDriver
                          ? 'bg-slate-900 border-slate-600 text-slate-300'
                          : isLuggage
                          ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-600 hover:border-slate-700'
                      }`}
                    >
                      {isSeat && (
                        <>
                          <Armchair className="w-4 h-4 mb-0.5 text-teal-400" />
                          <span className="font-bold text-[11px] text-white font-mono">
                            {cell.seatNumber ? `#${cell.seatNumber.toString().padStart(2, '0')}` : 'Asiento'}
                          </span>
                        </>
                      )}

                      {isDoor && (
                        <>
                          <DoorOpen className="w-5 h-5 text-teal-300" />
                          <span className="text-[8px] font-black uppercase text-teal-300">Puerta</span>
                        </>
                      )}

                      {isDriver && (
                        <>
                          <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          </div>
                          <span className="text-[8px] font-bold uppercase text-slate-400">Chofer</span>
                        </>
                      )}

                      {isLuggage && (
                        <>
                          <Luggage className="w-4 h-4 text-amber-400 mb-0.5" />
                          <span className="text-[8px] font-semibold text-amber-300">Bodega</span>
                        </>
                      )}

                      {isAisle && (
                        <span className="text-[9px] text-slate-700 font-mono">Pasillo</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="text-center pt-3 mt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Fondo Posterior (Maletero y Fila Trasera)
          </div>
        </div>

        {/* Action Buttons */}
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
