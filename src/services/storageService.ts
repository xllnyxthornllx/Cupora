import { MinivanModel, RouteOption, Trip, Seat, TicketData } from '../types'

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

// Default vehicle configurations (including the real Renault Master from user's photo with plate Z4V-753)
export const DEFAULT_MODELS: MinivanModel[] = [
  {
    id: 'renault-master-15',
    name: 'Renault Master 2.3 dCi (15 Asientos)',
    plate: 'Z4V-753', // From user photo!
    totalSeats: 15,
    driverName: 'Víctor "Dios es mi guía" Mamani',
    rows: 5,
    cols: 4,
    description: 'Minivan interurbana climatizada, asientos reclinables y portaequipaje posterior.',
    defaultPrice: 25.0
  },
  {
    id: 'mercedes-sprinter-14',
    name: 'Mercedes-Benz Sprinter 315 (14 Asientos)',
    plate: 'V9P-412',
    totalSeats: 14,
    driverName: 'Carlos Quispe Huanca',
    rows: 4,
    cols: 4,
    description: 'Unidad ejecutiva con cargadores USB y aire forzado.',
    defaultPrice: 25.0
  },
  {
    id: 'toyota-hiace-11',
    name: 'Toyota HiAce Commuter (11 Asientos)',
    plate: 'X3B-819',
    totalSeats: 11,
    driverName: 'Raúl Condori Flores',
    rows: 4,
    cols: 3,
    description: 'Vehículo ágil para rutas rápidas con salida cada 20 minutos.',
    defaultPrice: 25.0
  }
]

export function generateInitialSeats(model: MinivanModel, price: number): Seat[] {
  const seats: Seat[] = []
  
  if (model.id === 'toyota-hiace-11') {
    // 11 seats layout
    // Copilot: seat 1
    seats.push({ id: 1, number: 1, label: '01 (Copiloto)', row: 0, col: 2, status: 'available', price })
    // Row 1: 2 seats
    seats.push({ id: 2, number: 2, label: '02 (Ventana)', row: 1, col: 0, status: 'available', price })
    seats.push({ id: 3, number: 3, label: '03 (Ventana)', row: 1, col: 2, status: 'available', price })
    // Row 2: 2 seats
    seats.push({ id: 4, number: 4, label: '04 (Ventana)', row: 2, col: 0, status: 'available', price })
    seats.push({ id: 5, number: 5, label: '05 (Ventana)', row: 2, col: 2, status: 'available', price })
    // Row 3: 2 seats
    seats.push({ id: 6, number: 6, label: '06 (Ventana)', row: 3, col: 0, status: 'available', price })
    seats.push({ id: 7, number: 7, label: '07 (Ventana)', row: 3, col: 2, status: 'available', price })
    // Back row: 4 seats (8, 9, 10, 11)
    seats.push({ id: 8, number: 8, label: '08 (Fondo)', row: 4, col: 0, status: 'available', price })
    seats.push({ id: 9, number: 9, label: '09 (Fondo)', row: 4, col: 1, status: 'available', price })
    seats.push({ id: 10, number: 10, label: '10 (Fondo)', row: 4, col: 2, status: 'available', price })
    seats.push({ id: 11, number: 11, label: '11 (Fondo)', row: 4, col: 3, status: 'available', price })
    return seats
  }

  if (model.id === 'mercedes-sprinter-14') {
    // 14 seats layout
    // Copilot: 1
    seats.push({ id: 1, number: 1, label: '01 (Copiloto)', row: 0, col: 2, status: 'available', price })
    // Row 1: 2 + 1
    seats.push({ id: 2, number: 2, label: '02 (Ventana)', row: 1, col: 0, status: 'available', price })
    seats.push({ id: 3, number: 3, label: '03 (Pasillo)', row: 1, col: 1, status: 'available', price })
    seats.push({ id: 4, number: 4, label: '04 (Ventana)', row: 1, col: 3, status: 'available', price })
    // Row 2: 2 + 1
    seats.push({ id: 5, number: 5, label: '05 (Ventana)', row: 2, col: 0, status: 'available', price })
    seats.push({ id: 6, number: 6, label: '06 (Pasillo)', row: 2, col: 1, status: 'available', price })
    seats.push({ id: 7, number: 7, label: '07 (Ventana)', row: 2, col: 3, status: 'available', price })
    // Row 3: 2 + 1
    seats.push({ id: 8, number: 8, label: '08 (Ventana)', row: 3, col: 0, status: 'available', price })
    seats.push({ id: 9, number: 9, label: '09 (Pasillo)', row: 3, col: 1, status: 'available', price })
    seats.push({ id: 10, number: 10, label: '10 (Ventana)', row: 3, col: 3, status: 'available', price })
    // Back row: 4
    seats.push({ id: 11, number: 11, label: '11 (Fondo)', row: 4, col: 0, status: 'available', price })
    seats.push({ id: 12, number: 12, label: '12 (Fondo)', row: 4, col: 1, status: 'available', price })
    seats.push({ id: 13, number: 13, label: '13 (Fondo)', row: 4, col: 2, status: 'available', price })
    seats.push({ id: 14, number: 14, label: '14 (Fondo)', row: 4, col: 3, status: 'available', price })
    return seats
  }

  // Default: Renault Master (15 Seats)
  // Front Copilot 1 & 2
  seats.push({ id: 1, number: 1, label: '01 (Copiloto Centro)', row: 0, col: 2, status: 'available', price })
  seats.push({ id: 2, number: 2, label: '02 (Copiloto Ventana)', row: 0, col: 3, status: 'available', price })
  // Row 1: 2 left + 1 right
  seats.push({ id: 3, number: 3, label: '03 (Ventana Izq)', row: 1, col: 0, status: 'available', price })
  seats.push({ id: 4, number: 4, label: '04 (Pasillo)', row: 1, col: 1, status: 'available', price })
  seats.push({ id: 5, number: 5, label: '05 (Ventana Der)', row: 1, col: 3, status: 'available', price })
  // Row 2: 2 left + 1 right
  seats.push({ id: 6, number: 6, label: '06 (Ventana Izq)', row: 2, col: 0, status: 'available', price })
  seats.push({ id: 7, number: 7, label: '07 (Pasillo)', row: 2, col: 1, status: 'available', price })
  seats.push({ id: 8, number: 8, label: '08 (Ventana Der)', row: 2, col: 3, status: 'available', price })
  // Row 3: 2 left + 1 right
  seats.push({ id: 9, number: 9, label: '09 (Ventana Izq)', row: 3, col: 0, status: 'available', price })
  seats.push({ id: 10, number: 10, label: '10 (Pasillo)', row: 3, col: 1, status: 'available', price })
  seats.push({ id: 11, number: 11, label: '11 (Ventana Der)', row: 3, col: 3, status: 'available', price })
  // Row 4 (Back row 4 seats)
  seats.push({ id: 12, number: 12, label: '12 (Fondo Izq)', row: 4, col: 0, status: 'available', price })
  seats.push({ id: 13, number: 13, label: '13 (Fondo Centro 1)', row: 4, col: 1, status: 'available', price })
  seats.push({ id: 14, number: 14, label: '14 (Fondo Centro 2)', row: 4, col: 2, status: 'available', price })
  seats.push({ id: 15, number: 15, label: '15 (Fondo Der)', row: 4, col: 3, status: 'available', price })

  return seats
}

const STORAGE_KEY_TRIPS = 'cupora_trips_v1'
const STORAGE_KEY_MODELS = 'cupora_models_v1'
const STORAGE_KEY_TICKETS = 'cupora_tickets_v1'

// Broadcast Channel for live multi-tab synchronization
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('cupora_sync_bus') 
  : null

export function broadcastChange(type: string, payload?: any) {
  if (channel) {
    try {
      channel.postMessage({ type, payload, timestamp: Date.now() })
    } catch (e) {
      console.warn('BroadcastChannel error', e)
    }
  }
  // Also dispatch a custom event on the current window for local hooks
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

// Storage helpers
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
      // Check and release expired locks (8 minutes TTL)
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

  // Initialize initial trips
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

  // Pre-fill a couple of seats in the first trip to look realistic (1 ventanilla, 1 app)
  initialTrips[0].seats[0].status = 'sold_window'
  initialTrips[0].seats[0].passengerName = 'Roberto Quispe (Ventanilla)'
  initialTrips[0].seats[0].passengerDni = '29481920'

  initialTrips[0].seats[3].status = 'sold_app'
  initialTrips[0].seats[3].passengerName = 'Maritza Flores Díaz'
  initialTrips[0].seats[3].passengerDni = '46129845'
  initialTrips[0].seats[3].ticketCode = 'CUP-753-04'

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
