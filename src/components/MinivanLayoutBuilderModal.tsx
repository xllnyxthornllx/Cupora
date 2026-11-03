import React, { useState, useEffect, useRef } from 'react'
import { MinivanModel, LayoutCell, CellType, Trip } from '../types'
import { saveModels, saveTrips, generateInitialSeats } from '../services/storageService'
import { X, Armchair, DoorOpen, Luggage, Save, RotateCcw, Plus, Trash2, Check, Sparkles, HelpCircle } from 'lucide-react'

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
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [activeCellType, setActiveCellType] = useState<CellType>('seat')

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
        // Generate an empty grid
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

  // Helper to get or create cell
  const getCell = (row: number, col: number): LayoutCell => {
    const existing = gridCells.find(c => c.row === row && c.col === col)
    if (existing) return existing
    return { row, col, type: 'aisle' }
  }

  // Toggle cell type on click
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
    setGridCells(prev => {
      const existing = prev.find(c => c.row === row && c.col === col)
      const currentType = existing?.type || 'aisle'

      // Cycle: aisle -> seat -> door -> luggage -> driver -> aisle
      let nextType: CellType = 'seat'
      if (currentType === 'aisle') nextType = 'seat'
      else if (currentType === 'seat') nextType = 'door'
      else if (currentType === 'door') nextType = 'luggage'
      else if (currentType === 'luggage') nextType = 'driver'
      else if (currentType === 'driver') nextType = 'aisle'

      const filtered = prev.filter(c => !(c.row === row && c.col === col))
      return [...filtered, { row, col, type: nextType }]
    })
  }

  // Renumber all seats neatly
  const handleAutoRenumber = () => {
    let seatCounter = 1
    const updated = gridCells.map(cell => {
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

  const handleSave = () => {
    // Count total seats
    const seatCells = gridCells.filter(c => c.type === 'seat')
    const totalSeats = seatCells.length

    // Make sure seats have numbers
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
      doorCol: doorCell?.col ?? 3,
      totalSeats,
      layoutGrid: normalizedCells
    }

    onSaveModel(updatedModel)

    // Update seats in trips that use this model
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
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden text-slate-100 shadow-2xl p-6 relative max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Personalizador de Carrocería & Distribución
            </span>
            <h3 id="builder-title" className="text-lg font-bold text-white mt-0.5">
              Configurador de Asientos y Puerta de Minivan
            </h3>
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

        {/* Instructions & Quick Renumber */}
        <div className="mt-4 p-3 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-teal-300">
            <Sparkles className="w-4 h-4 shrink-0 text-teal-400" />
            <span>Toca cualquier casilla para cambiar entre: <strong>Asiento ➔ Puerta ➔ Maletero ➔ Chofer ➔ Pasillo</strong></span>
          </div>

          <button
            type="button"
            onClick={handleAutoRenumber}
            className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
          >
            Renumerar Asientos (1 al {totalSeatsCount})
          </button>
        </div>

        {/* Minivan Graphic Layout Builder Canvas */}
        <div className="mt-5 p-5 bg-slate-950 rounded-3xl border-2 border-slate-800 relative">
          <div className="text-center pb-3 mb-3 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Frente (Parabrisas)</span>
            <span className="text-teal-400">Total: {totalSeatsCount} Asientos Configurados</span>
          </div>

          {/* Grid rows */}
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
                          ? 'bg-teal-950 border-2 border-dashed border-teal-400 text-teal-300 font-bold'
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
                          <span className="font-bold text-[11px] text-white">
                            {cell.seatNumber ? `#${cell.seatNumber.toString().padStart(2, '0')}` : 'Asiento'}
                          </span>
                        </>
                      )}

                      {isDoor && (
                        <>
                          <DoorOpen className="w-5 h-5 text-teal-300 animate-pulse" />
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
                        <span className="text-[9px] text-slate-600 font-mono">Pasillo</span>
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
