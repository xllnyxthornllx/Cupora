import React, { useState } from 'react'
import { MinivanModel, Trip, TicketData } from '../types'
import { generateInitialSeats, saveModels, saveTrips } from '../services/storageService'
import { MinivanLayoutBuilderModal } from '../components/MinivanLayoutBuilderModal'
import { Shield, Plus, Bus, DollarSign, Users, TrendingUp, Car, Settings2, SlidersHorizontal, DoorOpen, Armchair } from 'lucide-react'

interface AdminViewProps {
  models: MinivanModel[]
  trips: Trip[]
  tickets: TicketData[]
  onUpdateModels: (models: MinivanModel[]) => void
  onUpdateTrips: (trips: Trip[]) => void
}

export const AdminView: React.FC<AdminViewProps> = ({
  models,
  trips,
  tickets,
  onUpdateModels,
  onUpdateTrips
}) => {
  const [showAddModelModal, setShowAddModelModal] = useState<boolean>(false)
  const [modelToCustomize, setModelToCustomize] = useState<MinivanModel | null>(null)

  const [newModelName, setNewModelName] = useState<string>('')
  const [newPlate, setNewPlate] = useState<string>('')
  const [newDriver, setNewDriver] = useState<string>('')
  const [newTotalSeats, setNewTotalSeats] = useState<number>(15)
  const [newPrice, setNewPrice] = useState<number>(25.0)

  // Compute metrics
  let totalRevenue = 0
  let appRevenue = 0
  let windowRevenue = 0
  let totalOccupied = 0
  let totalCapacity = 0

  trips.forEach(trip => {
    trip.seats.forEach(seat => {
      totalCapacity++
      if (seat.status !== 'available') {
        totalOccupied++
        totalRevenue += seat.price
        if (seat.status === 'sold_app') {
          appRevenue += seat.price
        } else if (seat.status === 'sold_window') {
          windowRevenue += seat.price
        }
      }
    })
  })

  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0

  const handleCreateModel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newModelName.trim() || !newPlate.trim()) return

    const newId = `model-${Date.now()}`
    const newModel: MinivanModel = {
      id: newId,
      name: newModelName.trim(),
      plate: newPlate.trim().toUpperCase(),
      driverName: newDriver.trim() || 'Conductor Asignado',
      totalSeats: newTotalSeats,
      rows: 6,
      cols: 4,
      doorRow: 1,
      doorCol: 3,
      description: 'Minivan configurada en el sistema de despacho Cupora.',
      defaultPrice: newPrice
    }

    const updatedModels = [...models, newModel]
    saveModels(updatedModels)
    onUpdateModels(updatedModels)

    // Also create a trip for this new unit
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      routeId: 'aqp-camana',
      modelId: newModel.id,
      departureTime: '08:00 AM',
      status: 'boarding',
      driverName: newModel.driverName,
      plate: newModel.plate,
      seats: generateInitialSeats(newModel, newPrice)
    }

    const updatedTrips = [...trips, newTrip]
    saveTrips(updatedTrips)
    onUpdateTrips(updatedTrips)

    // Reset form
    setNewModelName('')
    setNewPlate('')
    setNewDriver('')
    setShowAddModelModal(false)
  }

  const handleSaveCustomizedModel = (updatedModel: MinivanModel) => {
    const updated = models.map(m => m.id === updatedModel.id ? updatedModel : m)
    saveModels(updated)
    onUpdateModels(updated)
    setModelToCustomize(null)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Panel de Control & Despacho Central</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Monitoreo de Flota, Rutas y Arqueo
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervisa el estado en tiempo real de todas las minivanes y configura la distribución física de cada vehículo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModelModal(true)}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nueva Minivan a la Flota</span>
        </button>
      </div>

      {/* Global Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Recaudación Total</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            S/. {totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            App: S/.{appRevenue.toFixed(0)} | Ventanilla: S/.{windowRevenue.toFixed(0)}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Aforo Global de Flota</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalOccupied} / {totalCapacity}
          </div>
          <p className="text-[11px] text-teal-400 mt-1">
            {occupancyRate}% de ocupación actual
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Boletos Digitales Emitidos</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">
            {tickets.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Firmados con JWT Offline
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Minivanes en Operación</span>
            <Bus className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {models.length} unidades
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Personalización de Asientos Activa
          </p>
        </div>
      </div>

      {/* Flota Activa Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-teal-400" />
            <span>Unidades Minivanes Registradas y Distribución</span>
          </h3>
          <span className="text-xs text-teal-400 font-medium">
            💡 Toca "Mover Asientos & Puertas" para personalizar cada vehículo
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map(model => {
            const relatedTrip = trips.find(t => t.modelId === model.id)
            const occupied = relatedTrip?.seats.filter(s => s.status !== 'available').length || 0
            const capacity = model.totalSeats

            return (
              <div
                key={model.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-950 text-teal-400 border border-slate-800 font-bold">
                        {model.plate}
                      </span>
                      <h4 className="text-base font-bold text-white mt-2">
                        {model.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Capacidad</span>
                      <span className="text-sm font-bold text-teal-400">{model.totalSeats} asientos</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {model.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Conductor:</span>
                    <span className="text-white font-medium">{model.driverName}</span>
                  </div>

                  {/* Progress bar of occupancy */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Ocupación actual:</span>
                      <span className="text-teal-400 font-bold">{occupied} / {capacity} asientos</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${(occupied / capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Customizer Button */}
                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setModelToCustomize(model)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                    <span>Mover Asientos & Puertas</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Model Modal */}
      {showAddModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Registrar Nueva Minivan a la Flota
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModelModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateModel} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Marca y Modelo del Vehículo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Renault Master 2.3 dCi / Mercedes Sprinter"
                  value={newModelName}
                  onChange={e => setNewModelName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Número de Placa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Z4V-753"
                    value={newPlate}
                    onChange={e => setNewPlate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Capacidad Inicial de Asientos
                  </label>
                  <select
                    value={newTotalSeats}
                    onChange={e => setNewTotalSeats(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                  >
                    <option value={15}>15 Asientos (Renault Master)</option>
                    <option value={14}>14 Asientos (Sprinter)</option>
                    <option value={11}>11 Asientos (Toyota HiAce)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nombre del Conductor Asignado
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juan Carlos Mamani"
                  value={newDriver}
                  onChange={e => setNewDriver(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tarifa por Asiento (S/.)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newPrice}
                  onChange={e => setNewPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModelModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-600/30"
                >
                  Guardar Minivan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Minivan Layout Builder Modal */}
      {modelToCustomize && (
        <MinivanLayoutBuilderModal
          isOpen={!!modelToCustomize}
          onClose={() => setModelToCustomize(null)}
          modelToEdit={modelToCustomize}
          onSaveModel={handleSaveCustomizedModel}
          trips={trips}
          onUpdateTrips={onUpdateTrips}
        />
      )}
    </div>
  )
}
