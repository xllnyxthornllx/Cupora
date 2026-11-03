export type SeatStatus = 'available' | 'selected' | 'locked' | 'sold_app' | 'sold_window'

export type CellType = 'seat' | 'aisle' | 'door' | 'driver' | 'luggage'

export type DoorType = 'sliding' | 'front_right' | 'front_left' | 'rear'

export type UserRole = 'passenger' | 'driver' | 'admin'

export interface UserAccount {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  dni?: string
  assignedModelId?: string
  assignedPlate?: string
}

export interface FreeformLayoutItem {
  id: string
  type: 'seat' | 'door' | 'driver' | 'luggage'
  x: number // percentage 0 - 100 from left
  y: number // percentage 0 - 100 from top
  doorType?: DoorType
  seatNumber?: number
  label?: string
  price?: number
}

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
  passengerPhone?: string
  price: number
  ticketCode?: string
  paymentMethod?: 'yape' | 'plin' | 'card' | 'cash'
  lockedAt?: number
  refunded?: boolean
  refundedAt?: string
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
  freeformElements?: FreeformLayoutItem[]
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
  status: 'valid' | 'boarded' | 'cancelled' | 'refunded'
  paymentMethod?: 'yape' | 'plin' | 'card' | 'cash'
  qrPayload: string
  purchasedAt: string
  refundedAt?: string
  refundReason?: string
}
