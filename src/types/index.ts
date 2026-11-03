export type SeatStatus = 'available' | 'selected' | 'locked' | 'sold_app' | 'sold_window'

export type CellType = 'seat' | 'aisle' | 'door' | 'driver' | 'luggage'

export interface LayoutCell {
  row: number
  col: number
  type: CellType
  seatNumber?: number
  label?: string
  price?: number
}

export interface Seat {
  id: number
  number: number
  label: string
  row: number
  col: number
  status: SeatStatus
  passengerName?: string
  passengerDni?: string
  price: number
  ticketCode?: string
  paymentMethod?: 'yape' | 'plin' | 'card' | 'cash'
  lockedAt?: number // timestamp
}

export interface MinivanModel {
  id: string
  name: string
  plate: string
  totalSeats: number
  driverName: string
  rows: number
  cols: number
  doorRow: number
  doorCol: number
  description: string
  defaultPrice: number
  layoutGrid?: LayoutCell[]
}

export interface RouteOption {
  id: string
  origin: string
  destination: string
  distanceKm: number
  duration: string
  basePrice: number
  departureTime: string
  frequencyMinutes: number
}

export type TripStatus = 'boarding' | 'full' | 'in_transit' | 'completed'

export interface Trip {
  id: string
  routeId: string
  modelId: string
  departureTime: string
  status: TripStatus
  driverName: string
  plate: string
  seats: Seat[]
}

export interface TicketData {
  id: string
  tripId: string
  origin: string
  destination: string
  seatNumber: number
  passengerName: string
  passengerDni: string
  passengerPhone: string
  price: number
  plate: string
  driverName: string
  departureTime: string
  date: string
  status: 'valid' | 'boarded' | 'cancelled'
  qrPayload: string
  purchasedAt: string
}
