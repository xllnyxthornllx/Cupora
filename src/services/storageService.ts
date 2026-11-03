import { MinivanModel, RouteOption, Trip, Seat, TicketData, LayoutCell, FreeformLayoutItem, UserAccount } from '../types'

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user-passenger-01',
    name: 'Juan Carlos Pérez',
    email: 'pasajero@cupora.pe',
    role: 'passenger',
    phone: '954 123 456',
    dni: '45918234'
  },
  {
    id: 'user-driver-01',
    name: 'Víctor Mamani',
    email: 'chofer@cupora.pe',
    role: 'driver',
    phone: '984 765 432',
    dni: '29841203',
    assignedModelId: 'renault-master-15',
    assignedPlate: 'Z4V-753'
  },
  {
    id: 'user-admin-01',
    name: 'Central de Despacho & Control',
    email: 'admin@cupora.pe',
    role: 'admin',
    phone: '054 284910',
    dni: '10482910'
  }
]

const STORAGE_KEY_AUTH_USER = 'cupora_auth_user_v1'
const STORAGE_KEY_USERS_LIST = 'cupora_registered_users_v1'

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return DEFAULT_USERS[0]
}

export function setCurrentUser(user: UserAccount | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY_AUTH_USER)
  }
  broadcastChange('AUTH_CHANGED', user)
}

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS_LIST)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(DEFAULT_USERS))
  return DEFAULT_USERS
}

export function registerNewUser(account: UserAccount): UserAccount {
  const users = getAllUsers()
  const updated = [...users, account]
  localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(updated))
  setCurrentUser(account)
  return account
}

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

// Realistic 3-Door Peruvian Minivan Layouts with Magnetic Row Alignment
export function buildDefaultRenaultFreeform(): FreeformLayoutItem[] {
  return [
    // 3 Real Doors of the Minivan:
    { id: 'door-driver', type: 'door', doorType: 'front_left', x: 6, y: 10, label: 'Puerta Chofer' },
    { id: 'door-copilot', type: 'door', doorType: 'front_right', x: 94, y: 10, label: 'Puerta Copiloto' },
    { id: 'door-sliding', type: 'door', doorType: 'sliding', x: 94, y: 26, label: 'Puerta Corrediza' },

    // Front Cabin:
    { id: 'drv-01', type: 'driver', x: 22, y: 10, label: 'Chofer' },
    { id: 'seat-01', type: 'seat', x: 60, y: 10, seatNumber: 1, label: '01 Copiloto Centro' },
    { id: 'seat-02', type: 'seat', x: 80, y: 10, seatNumber: 2, label: '02 Copiloto Ventana' },

    // Row 1 (Entry row with wide walking space next to sliding door):
    { id: 'seat-03', type: 'seat', x: 22, y: 26, seatNumber: 3, label: '03 Ventana Izq' },
    { id: 'seat-04', type: 'seat', x: 42, y: 26, seatNumber: 4, label: '04 Pasillo Izq' },

    // Row 2 (2 seats left, central aisle, 1 seat right):
    { id: 'seat-05', type: 'seat', x: 22, y: 41, seatNumber: 5, label: '05 Ventana Izq' },
    { id: 'seat-06', type: 'seat', x: 42, y: 41, seatNumber: 6, label: '06 Pasillo Izq' },
    { id: 'seat-07', type: 'seat', x: 80, y: 41, seatNumber: 7, label: '07 Ventana Der' },

    // Row 3:
    { id: 'seat-08', type: 'seat', x: 22, y: 56, seatNumber: 8, label: '08 Ventana Izq' },
    { id: 'seat-09', type: 'seat', x: 42, y: 56, seatNumber: 9, label: '09 Pasillo Izq' },
    { id: 'seat-10', type: 'seat', x: 80, y: 56, seatNumber: 10, label: '10 Ventana Der' },

    // Row 4:
    { id: 'seat-11', type: 'seat', x: 22, y: 71, seatNumber: 11, label: '11 Ventana Izq' },
    { id: 'seat-12', type: 'seat', x: 42, y: 71, seatNumber: 12, label: '12 Pasillo Izq' },
    { id: 'seat-13', type: 'seat', x: 80, y: 71, seatNumber: 13, label: '13 Ventana Der' },

    // Row 5 (Rear 4 seats aligned straight):
    { id: 'seat-14', type: 'seat', x: 19, y: 86, seatNumber: 14, label: '14 Fondo Izq' },
    { id: 'seat-15', type: 'seat', x: 39, y: 86, seatNumber: 15, label: '15 Fondo Centro' },
    { id: 'seat-16', type: 'seat', x: 61, y: 86, seatNumber: 16, label: '16 Fondo Centro' },
    { id: 'seat-17', type: 'seat', x: 81, y: 86, seatNumber: 17, label: '17 Fondo Der' },

    // Rear Luggage Door:
    { id: 'door-rear', type: 'door', doorType: 'rear', x: 50, y: 96, label: 'Portón Trasero' }
  ]
}

export function buildDefaultSprinterFreeform(): FreeformLayoutItem[] {
  return [
    { id: 'door-driver', type: 'door', doorType: 'front_left', x: 6, y: 9, label: 'Puerta Chofer' },
    { id: 'door-copilot', type: 'door', doorType: 'front_right', x: 94, y: 9, label: 'Puerta Copiloto' },
    { id: 'door-sliding', type: 'door', doorType: 'sliding', x: 94, y: 24, label: 'Puerta Corrediza' },

    { id: 'drv-01', type: 'driver', x: 22, y: 9, label: 'Chofer' },
    { id: 'seat-01', type: 'seat', x: 78, y: 9, seatNumber: 1, label: '01 Copiloto' },

    { id: 'seat-02', type: 'seat', x: 22, y: 24, seatNumber: 2, label: '02 Ventana Izq' },
    { id: 'seat-03', type: 'seat', x: 44, y: 24, seatNumber: 3, label: '03 Pasillo Izq' },

    { id: 'seat-04', type: 'seat', x: 22, y: 38, seatNumber: 4, label: '04 Ventana' },
    { id: 'seat-05', type: 'seat', x: 44, y: 38, seatNumber: 5, label: '05 Pasillo' },
    { id: 'seat-06', type: 'seat', x: 78, y: 38, seatNumber: 6, label: '06 Ventana Der' },

    { id: 'seat-07', type: 'seat', x: 22, y: 51, seatNumber: 7, label: '07 Ventana' },
    { id: 'seat-08', type: 'seat', x: 44, y: 51, seatNumber: 8, label: '08 Pasillo' },
    { id: 'seat-09', type: 'seat', x: 78, y: 51, seatNumber: 9, label: '09 Ventana Der' },

    { id: 'seat-10', type: 'seat', x: 22, y: 64, seatNumber: 10, label: '10 Ventana' },
    { id: 'seat-11', type: 'seat', x: 44, y: 64, seatNumber: 11, label: '11 Pasillo' },
    { id: 'seat-12', type: 'seat', x: 78, y: 64, seatNumber: 12, label: '12 Ventana Der' },

    { id: 'seat-13', type: 'seat', x: 22, y: 77, seatNumber: 13, label: '13 Ventana' },
    { id: 'seat-14', type: 'seat', x: 44, y: 77, seatNumber: 14, label: '14 Pasillo' },
    { id: 'seat-15', type: 'seat', x: 78, y: 77, seatNumber: 15, label: '15 Ventana Der' },

    { id: 'seat-16', type: 'seat', x: 19, y: 90, seatNumber: 16, label: '16 Fondo Izq' },
    { id: 'seat-17', type: 'seat', x: 39, y: 90, seatNumber: 17, label: '17 Fondo' },
    { id: 'seat-18', type: 'seat', x: 59, y: 90, seatNumber: 18, label: '18 Fondo' },
    { id: 'seat-19', type: 'seat', x: 80, y: 90, seatNumber: 19, label: '19 Fondo Der' },

    { id: 'door-rear', type: 'door', doorType: 'rear', x: 50, y: 97, label: 'Portón Trasero' }
  ]
}

export function buildDefaultHiAceFreeform(): FreeformLayoutItem[] {
  return [
    { id: 'door-driver', type: 'door', doorType: 'front_left', x: 6, y: 10, label: 'Puerta Chofer' },
    { id: 'door-copilot', type: 'door', doorType: 'front_right', x: 94, y: 10, label: 'Puerta Copiloto' },
    { id: 'door-sliding', type: 'door', doorType: 'sliding', x: 94, y: 28, label: 'Puerta Corrediza' },

    { id: 'drv-01', type: 'driver', x: 24, y: 10, label: 'Chofer' },
    { id: 'seat-01', type: 'seat', x: 76, y: 10, seatNumber: 1, label: '01 Copiloto' },

    { id: 'seat-02', type: 'seat', x: 24, y: 28, seatNumber: 2, label: '02 Ventana Izq' },

    { id: 'seat-03', type: 'seat', x: 24, y: 46, seatNumber: 3, label: '03 Ventana' },
    { id: 'seat-04', type: 'seat', x: 48, y: 46, seatNumber: 4, label: '04 Pasillo' },
    { id: 'seat-05', type: 'seat', x: 76, y: 46, seatNumber: 5, label: '05 Ventana Der' },

    { id: 'seat-06', type: 'seat', x: 24, y: 64, seatNumber: 6, label: '06 Ventana' },
    { id: 'seat-07', type: 'seat', x: 48, y: 64, seatNumber: 7, label: '07 Pasillo' },
    { id: 'seat-08', type: 'seat', x: 76, y: 64, seatNumber: 8, label: '08 Ventana Der' },

    { id: 'seat-09', type: 'seat', x: 18, y: 88, seatNumber: 9, label: '09 Fondo Izq' },
    { id: 'seat-10', type: 'seat', x: 39, y: 88, seatNumber: 10, label: '10 Fondo Centro' },
    { id: 'seat-11', type: 'seat', x: 60, y: 88, seatNumber: 11, label: '11 Fondo Centro' },
    { id: 'seat-12', type: 'seat', x: 82, y: 88, seatNumber: 12, label: '12 Fondo Der' },

    { id: 'door-rear', type: 'door', doorType: 'rear', x: 50, y: 96, label: 'Portón Trasero' }
  ]
}

export const DEFAULT_MODELS: MinivanModel[] = [
  {
    id: 'renault-master-15',
    name: 'Renault Master 2.3 dCi (17 Asientos)',
    plate: 'Z4V-753',
    totalSeats: 17,
    driverName: 'Víctor "Dios es mi guía" Mamani',
    rows: 7,
    cols: 4,
    doorRow: 1,
    doorCol: 3,
    description: 'Minivan interurbana climatizada, puerta corrediza derecha, maletero posterior.',
    defaultPrice: 25.0,
    seatScale: 'lg',
    freeformElements: buildDefaultRenaultFreeform()
  },
  {
    id: 'mercedes-sprinter-14',
    name: 'Mercedes-Benz Sprinter 315 (19 Asientos Larga)',
    plate: 'V9P-412',
    totalSeats: 19,
    driverName: 'Carlos Quispe Huanca',
    rows: 8,
    cols: 4,
    doorRow: 1,
    doorCol: 3,
    description: 'Unidad ejecutiva con cargadores USB, pasillo amplio y aire forzado.',
    defaultPrice: 25.0,
    seatScale: 'lg',
    freeformElements: buildDefaultSprinterFreeform()
  },
  {
    id: 'toyota-hiace-11',
    name: 'Toyota HiAce Commuter (12 Asientos)',
    plate: 'X3B-819',
    totalSeats: 12,
    driverName: 'Raúl Condori Flores',
    rows: 6,
    cols: 4,
    doorRow: 1,
    doorCol: 3,
    description: 'Vehículo ágil para rutas rápidas con salida cada 20 minutos.',
    defaultPrice: 25.0,
    seatScale: 'lg',
    freeformElements: buildDefaultHiAceFreeform()
  }
]

export function generateInitialSeats(model: MinivanModel, price: number): Seat[] {
  if (model.freeformElements && model.freeformElements.length > 0) {
    const seatItems = model.freeformElements.filter(e => e.type === 'seat')
    return seatItems.map((item, idx) => {
      const num = item.seatNumber ?? (idx + 1)
      return {
        id: num,
        number: num,
        label: item.label || `Asiento ${num.toString().padStart(2, '0')}`,
        row: Math.round((item.y / 100) * 8),
        col: Math.round((item.x / 100) * 4),
        status: 'available',
        price: item.price || price
      }
    })
  }

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

const STORAGE_KEY_TRIPS = 'cupora_trips_v4'
const STORAGE_KEY_MODELS = 'cupora_models_v4'
const STORAGE_KEY_TICKETS = 'cupora_tickets_v4'

const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('cupora_sync_bus_v4') 
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
  localStorage.removeItem(STORAGE_KEY_AUTH_USER)
  broadcastChange('DEMO_RESET')
}
