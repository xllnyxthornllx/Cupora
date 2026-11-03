import { MinivanModel, RouteOption, Trip, Seat, TicketData, LayoutCell } from '../types'

// Default Peruvian interurban routes
export const DEFAULT_ROUTES: RouteOption[] = [
  {
    id: 'aqp-camana',
    origin: 'Arequipa (Terminal Minivanes)',
    destination: 'Camaná (Terminal Terrestre)',
    distanceKm: 175,
    duration: '2h 45m',
    basePrice: 25.0,
    departureTime: '06:30 AM',
    frequencyMinutes: 30
  },
  {
    id: 'aqp-mollendo',
    origin: 'Arequipa (Terminal Minivanes)',
    destination: 'Mollendo (Terminal de Playas)',
    distanceKm: 125,
    duration: '2h 15m',
    basePrice: 20.0,
    departureTime: '07:00 AM',
    frequencyMinutes: 20
  },
  {
    id: 'aqp-moquegua',
    origin: 'Arequipa (Terminal Minivanes)',
    destination: 'Moquegua (Terminal Interurbano)',
    distanceKm: 215,
    duration: '3h 10m',
    basePrice: 32.0,
    departureTime: '07:30 AM',
    frequencyMinutes: 45
  },
  {
    id: 'aqp-pedregal',
    origin: 'Arequipa (Terminal Minivanes)',
    destination: 'Pedregal - El Majes',
    distanceKm: 105,
    duration: '1h 50m',
    basePrice: 18.0,
    departureTime: '06:00 AM',
    frequencyMinutes: 15
  }
]

export function buildDefaultRenaultMasterLayout(): LayoutCell[] {
  // 5 rows x 4 cols (15 seats + driver + sliding door)
  const cells: LayoutCell[] = []
  // Row 0: Driver (0,0), Aisle (0,1), Copilot 1 (0,2), Copilot 2 (0,3)
  cells.push({ row: 0, col: 0, type: 'driver', label: 'Chofer' })
  cells.push({ row: 0, col: 1, type: 'aisle' })
  cells.push({ row: 0, col: 2, type: 'seat', seatNumber: 1, label: '01 Copiloto Centro' })
  cells.push({ row: 0, col: 3, type: 'seat', seatNumber: 2, label: '02 Copiloto Ventana' })

  // Row 1: Seat 3 (1,0), Seat 4 (1,1), Aisle (1,2), Door (1,3 - Puerta Corrediza Lateral)
  cells.push({ row: 1, col: 0, type: 'seat', seatNumber: 3, label: '03 Ventana Izquierda' })
  cells.push({ row: 1, col: 1, type: 'seat', seatNumber: 4, label: '04 Pasillo' })
  cells.push({ row: 1, col: 2, type: 'aisle' })
  cells.push({ row: 1, col: 3, type: 'door', label: 'Puerta de Subida' })

  // Row 2: Seat 5 (2,0), Seat 6 (2,1), Aisle (2,2), Seat 7 (2,3)
  cells.push({ row: 2, col: 0, type: 'seat', seatNumber: 5, label: '05 Ventana Izquierda' })
  cells.push({ row: 2, col: 1, type: 'seat', seatNumber: 6, label: '06 Pasillo' })
  cells.push({ row: 2, col: 2, type: 'aisle' })
  cells.push({ row: 2, col: 3, type: 'seat', seatNumber: 7, label: '07 Ventana Derecha' })

  // Row 3: Seat 8 (3,0), Seat 9 (3,1), Aisle (3,2), Seat 10 (3,3)
  cells.push({ row: 3, col: 0, type: 'seat', seatNumber: 8, label: '08 Ventana Izquierda' })
  cells.push({ row: 3, col: 1, type: 'seat', seatNumber: 9, label: '09 Pasillo' })
  cells.push({ row: 3, col: 2, type: 'aisle' })
  cells.push({ row: 3, col: 3, type: 'seat', seatNumber: 10, label: '10 Ventana Derecha' })

  // Row 4: Seat 11 (4,0), Seat 12 (4,1), Seat 13 (4,2), Seat 14 (4,3)
  cells.push({ row: 4, col: 0, type: 'seat', seatNumber: 11, label: '11 Fondo Izquierda' })
  cells.push({ row: 4, col: 1, type: 'seat', seatNumber: 12, label: '12 Fondo Centro 1' })
  cells.push({ row: 4, col: 2, type: 'seat', seatNumber: 13, label: '13 Fondo Centro 2' })
  cells.push({ row: 4, col: 3, type: 'seat', seatNumber: 14, label: '14 Fondo Derecha' })

  // Row 5: Additional seat or luggage space
  cells.push({ row: 5, col: 0, type: 'seat', seatNumber: 15, label: '15 Asiento Posterior' })
  cells.push({ row: 5, col: 1, type: 'luggage', label: 'Maletero' })
  cells.push({ row: 5, col: 2, type: 'luggage', label: 'Maletero' })
  cells.push({ row: 5, col: 3, type: 'luggage', label: 'Maletero' })

  return cells
}

export function buildDefaultSprinterLayout(): LayoutCell[] {
  const cells: LayoutCell[] = []
  // Row 0: Driver (0,0), Aisle (0,1), Aisle (0,2), Copilot 1 (0,3)
  cells.push({ row: 0, col: 0, type: 'driver', label: 'Chofer' })
  cells.push({ row: 0, col: 1, type: 'aisle' })
  cells.push({ row: 0, col: 2, type: 'aisle' })
  cells.push({ row: 0, col: 3, type: 'seat', seatNumber: 1, label: '01 Copiloto' })

  // Row 1: Seat 2, 3, Aisle, Door
  cells.push({ row: 1, col: 0, type: 'seat', seatNumber: 2, label: '02 Ventana Izq' })
  cells.push({ row: 1, col: 1, type: 'seat', seatNumber: 3, label: '03 Pasillo Izq' })
  cells.push({ row: 1, col: 2, type: 'aisle' })
  cells.push({ row: 1, col: 3, type: 'door', label: 'Puerta de Subida' })

  // Row 2: Seat 4, 5, Aisle, Seat 6
  cells.push({ row: 2, col: 0, type: 'seat', seatNumber: 4, label: '04 Ventana' })
  cells.push({ row: 2, col: 1, type: 'seat', seatNumber: 5, label: '05 Pasillo' })
  cells.push({ row: 2, col: 2, type: 'aisle' })
  cells.push({ row: 2, col: 3, type: 'seat', seatNumber: 6, label: '06 Ventana Der' })

  // Row 3: Seat 7, 8, Aisle, Seat 9
  cells.push({ row: 3, col: 0, type: 'seat', seatNumber: 7, label: '07 Ventana' })
  cells.push({ row: 3, col: 1, type: 'seat', seatNumber: 8, label: '08 Pasillo' })
  cells.push({ row: 3, col: 2, type: 'aisle' })
  cells.push({ row: 3, col: 3, type: 'seat', seatNumber: 9, label: '09 Ventana Der' })

  // Row 4: Seat 10, 11, Aisle, Seat 12
  cells.push({ row: 4, col: 0, type: 'seat', seatNumber: 10, label: '10 Ventana' })
  cells.push({ row: 4, col: 1, type: 'seat', seatNumber: 11, label: '11 Pasillo' })
  cells.push({ row: 4, col: 2, type: 'aisle' })
  cells.push({ row: 4, col: 3, type: 'seat', seatNumber: 12, label: '12 Ventana' })

  // Row 5: Back Row (13, 14, 15)
  cells.push({ row: 5, col: 0, type: 'seat', seatNumber: 13, label: '13 Fondo' })
  cells.push({ row: 5, col: 1, type: 'seat', seatNumber: 14, label: '14 Fondo' })
  cells.push({ row: 5, col: 2, type: 'luggage', label: 'Bodega' })
  cells.push({ row: 5, col: 3, type: 'luggage', label: 'Bodega' })

  return cells
}

export function buildDefaultHiAceLayout(): LayoutCell[] {
  const cells: LayoutCell[] = []
  // Row 0
  cells.push({ row: 0, col: 0, type: 'driver', label: 'Chofer' })
  cells.push({ row: 0, col: 1, type: 'aisle' })
  cells.push({ row: 0, col: 2, type: 'aisle' })
  cells.push({ row: 0, col: 3, type: 'seat', seatNumber: 1, label: '01 Copiloto' })

  // Row 1
  cells.push({ row: 1, col: 0, type: 'seat', seatNumber: 2, label: '02 Ventana' })
  cells.push({ row: 1, col: 1, type: 'aisle' })
  cells.push({ row: 1, col: 2, type: 'aisle' })
  cells.push({ row: 1, col: 3, type: 'door', label: 'Puerta Lateral' })

  // Row 2
  cells.push({ row: 2, col: 0, type: 'seat', seatNumber: 3, label: '03 Ventana' })
  cells.push({ row: 2, col: 1, type: 'seat', seatNumber: 4, label: '04 Pasillo' })
  cells.push({ row: 2, col: 2, type: 'aisle' })
  cells.push({ row: 2, col: 3, type: 'seat', seatNumber: 5, label: '05 Ventana Der' })

  // Row 3
  cells.push({ row: 3, col: 0, type: 'seat', seatNumber: 6, label: '06 Ventana' })
  cells.push({ row: 3, col: 1, type: 'seat', seatNumber: 7, label: '07 Pasillo' })
  cells.push({ row: 3, col: 2, type: 'aisle' })
  cells.push({ row: 3, col: 3, type: 'seat', seatNumber: 8, label: '08 Ventana Der' })

  // Row 4
  cells.push({ row: 4, col: 0, type: 'seat', seatNumber: 9, label: '09 Fondo Izq' })
  cells.push({ row: 4, col: 1, type: 'seat', seatNumber: 10, label: '10 Fondo Centro' })
  cells.push({ row: 4, col: 2, type: 'aisle' })
  cells.push({ row: 4, col: 3, type: 'seat', seatNumber: 11, label: '11 Fondo Der' })

  return cells
}

export const DEFAULT_MODELS: MinivanModel[] = [
  {
    id: 'renault-master-15',
    name: 'Renault Master 2.3 dCi (15 Asientos)',
    plate: 'Z4V-753', // Photo plate
    totalSeats: 15,
    driverName: 'Víctor "Dios es mi guía" Mamani',
    rows: 6,
    cols: 4,
    doorRow: 1,
    doorCol: 3,
    description: 'Minivan interurbana climatizada, puerta corrediza derecha, maletero posterior.',
    defaultPrice: 25.0,
    layoutGrid: buildDefaultRenaultMasterLayout()
  },
  {
    id: 'mercedes-sprinter-14',
    name: 'Mercedes-Benz Sprinter 315 (14 Asientos)',
    plate: 'V9P-412',
    totalSeats: 14,
    driverName: 'Carlos Quispe Huanca',
    rows: 6,
    cols: 4,
    doorRow: 1,
    doorCol: 3,
    description: 'Unidad ejecutiva con cargadores USB y aire forzado.',
    defaultPrice: 25.0,
    layoutGrid: buildDefaultSprinterLayout()
  },
  {
    id: 'toyota-hiace-11',
    name: 'Toyota HiAce Commuter (11 Asientos)',
    plate: 'X3B-819',
    totalSeats: 11,
    driverName: 'Raúl Condori Flores',
    rows: 5,
    cols: 4,
    doorRow: 1,
    doorCol: 3,
    description: 'Vehículo ágil para rutas rápidas con salida cada 20 minutos.',
    defaultPrice: 25.0,
    layoutGrid: buildDefaultHiAceLayout()
  }
]

export function generateInitialSeats(model: MinivanModel, price: number): Seat[] {
  // If model has custom layout grid, generate seats strictly from layoutGrid!
  if (model.layoutGrid && model.layoutGrid.length > 0) {
    const seatCells = model.layoutGrid.filter(c => c.type === 'seat')
    return seatCells.map((cell, idx) => {
      const num = cell.seatNumber ?? (idx + 1)
      return {
        id: num,
        number: num,
        label: cell.label || `Asiento ${num.toString().padStart(2, '0')}`,
        row: cell.row,
        col: cell.col,
        status: 'available',
        price: cell.price || price
      }
    })
  }

  // Fallback default 15 seats
  const seats: Seat[] = []
  for (let i = 1; i <= model.totalSeats; i++) {
    seats.push({
      id: i,
      number: i,
      label: `Asiento ${i.toString().padStart(2, '0')}`,
      row: Math.floor((i - 1) / 3),
      col: (i - 1) % 3,
      status: 'available',
      price
    })
  }
  return seats
}

const STORAGE_KEY_TRIPS = 'cupora_trips_v2'
const STORAGE_KEY_MODELS = 'cupora_models_v2'
const STORAGE_KEY_TICKETS = 'cupora_tickets_v2'

// Broadcast Channel for live multi-tab synchronization
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('cupora_sync_bus_v2') 
  : null

export function broadcastChange(type: string, payload?: any) {
  if (channel) {
    try {
      channel.postMessage({ type, payload, timestamp: Date.now() })
    } catch (e) {
      console.warn('BroadcastChannel error', e)
    }
  }
  window.dispatchEvent(new CustomEvent('cupora_local_update', { detail: { type, payload } }))
}

export function subscribeToSync(callback: (type: string, payload?: any) => void) {
  const channelHandler = (event: MessageEvent) => {
    if (event.data?.type) {
      callback(event.data.type, event.data.payload)
    }
  }
  const localHandler = (event: Event) => {
    const custom = event as CustomEvent
    if (custom.detail?.type) {
      callback(custom.detail.type, custom.detail.payload)
    }
  }

  if (channel) {
    channel.addEventListener('message', channelHandler)
  }
  window.addEventListener('cupora_local_update', localHandler)

  return () => {
    if (channel) {
      channel.removeEventListener('message', channelHandler)
    }
    window.removeEventListener('cupora_local_update', localHandler)
  }
}

export function getSavedModels(): MinivanModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MODELS)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  saveModels(DEFAULT_MODELS)
  return DEFAULT_MODELS
}

export function saveModels(models: MinivanModel[]) {
  localStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(models))
  broadcastChange('MODELS_UPDATED', models)
}

export function getSavedTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPS)
    if (raw) {
      const trips: Trip[] = JSON.parse(raw)
      const now = Date.now()
      let updated = false
      trips.forEach(t => {
        t.seats.forEach(s => {
          if (s.status === 'locked' && s.lockedAt && now - s.lockedAt > 8 * 60 * 1000) {
            s.status = 'available'
            s.passengerName = undefined
            s.passengerDni = undefined
            s.lockedAt = undefined
            updated = true
          }
        })
      })
      if (updated) {
        saveTrips(trips)
      }
      return trips
    }
  } catch (e) {}

  const models = getSavedModels()
  const initialTrips: Trip[] = [
    {
      id: 'trip-camana-01',
      routeId: 'aqp-camana',
      modelId: models[0].id,
      departureTime: '06:30 AM',
      status: 'boarding',
      driverName: models[0].driverName,
      plate: models[0].plate,
      seats: generateInitialSeats(models[0], 25.0)
    },
    {
      id: 'trip-mollendo-01',
      routeId: 'aqp-mollendo',
      modelId: models[1].id,
      departureTime: '07:00 AM',
      status: 'boarding',
      driverName: models[1].driverName,
      plate: models[1].plate,
      seats: generateInitialSeats(models[1], 20.0)
    },
    {
      id: 'trip-moquegua-01',
      routeId: 'aqp-moquegua',
      modelId: models[2].id,
      departureTime: '07:30 AM',
      status: 'boarding',
      driverName: models[2].driverName,
      plate: models[2].plate,
      seats: generateInitialSeats(models[2], 32.0)
    }
  ]

  if (initialTrips[0].seats.length > 3) {
    initialTrips[0].seats[0].status = 'sold_window'
    initialTrips[0].seats[0].passengerName = 'Roberto Quispe (Ventanilla)'
    initialTrips[0].seats[0].passengerDni = '29481920'

    initialTrips[0].seats[2].status = 'sold_app'
    initialTrips[0].seats[2].passengerName = 'Maritza Flores Díaz'
    initialTrips[0].seats[2].passengerDni = '46129845'
    initialTrips[0].seats[2].ticketCode = 'CUP-753-03'
  }

  saveTrips(initialTrips)
  return initialTrips
}

export function saveTrips(trips: Trip[]) {
  localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips))
  broadcastChange('TRIPS_UPDATED', trips)
}

export function getSavedTickets(): TicketData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TICKETS)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return []
}

export function saveTickets(tickets: TicketData[]) {
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets))
  broadcastChange('TICKETS_UPDATED', tickets)
}

export function addTicket(ticket: TicketData) {
  const current = getSavedTickets()
  const updated = [ticket, ...current]
  saveTickets(updated)
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY_TRIPS)
  localStorage.removeItem(STORAGE_KEY_MODELS)
  localStorage.removeItem(STORAGE_KEY_TICKETS)
  broadcastChange('DEMO_RESET')
}
