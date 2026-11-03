import React, { useRef, useEffect, useState } from 'react'
import { Seat, Trip, TicketData } from '../types'
import { X, RotateCcw, AlertTriangle, CheckCircle2, DollarSign, Smartphone, Banknote } from 'lucide-react'

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  seat: Seat | null
  trip: Trip | null
  onConfirmRefund: (seat: Seat, reason: string) => void
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  seat,
  trip,
  onConfirmRefund
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [reason, setReason] = useState<string>('El cliente ya no podrá viajar (solicitud voluntaria)')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen])

  if (!isOpen || !seat) return null

  const getMethodBadge = (method?: string) => {
    switch (method) {
      case 'yape':
        return { label: 'Yape Móvil', color: 'bg-purple-950 text-purple-300 border-purple-800' }
      case 'plin':
        return { label: 'Plin Interbancario', color: 'bg-sky-950 text-sky-300 border-sky-800' }
      case 'card':
        return { label: 'Tarjeta Débito/Crédito', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' }
      case 'cash':
      default:
        return { label: 'Efectivo en Ventanilla', color: 'bg-amber-950 text-amber-300 border-amber-800' }
    }
  }

  const methodBadge = getMethodBadge(seat.paymentMethod)

  const handleConfirm = () => {
    onConfirmRefund(seat, reason)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="p-0 bg-transparent max-w-md w-full rounded-3xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-md shadow-2xl m-auto"
      aria-labelledby="refund-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden text-slate-100 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 id="refund-title" className="text-base font-bold text-white">
              Anular Pasaje & Devolución de Dinero
            </h3>
            <p className="text-xs text-slate-400">
              Liberación de asiento y reintegro al pasajero
            </p>
          </div>
        </div>

        {/* Passenger & Ticket Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Asiento Reservado:</span>
            <span className="font-bold text-white text-sm font-mono">
              #{seat.number.toString().padStart(2, '0')} ({seat.label})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Nombre del Pasajero:</span>
            <span className="font-semibold text-white truncate max-w-[200px]">
              {seat.passengerName || 'Pasajero no registrado'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Documento DNI:</span>
            <span className="font-mono text-slate-300">
              {seat.passengerDni || 'No registrado'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Canal / Método de Pago:</span>
            <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${methodBadge.color}`}>
              {methodBadge.label}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm">
            <span className="text-slate-300 font-semibold">Monto a Devolver:</span>
            <span className="text-emerald-400 font-black text-base font-mono">
              S/. {seat.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Reason selector */}
        <div className="mt-4 space-y-1 text-xs">
          <label className="block text-slate-300 font-medium">Motivo de la Anulación / Reembolso</label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500"
          >
            <option value="El cliente ya no podrá viajar (solicitud voluntaria)">El cliente ya no podrá viajar (solicitud voluntaria)</option>
            <option value="Cambio de horario o de fecha de viaje">Cambio de horario o de fecha de viaje</option>
            <option value="Error en la selección del asiento">Error en la selección del asiento</option>
            <option value="Problema mecánico o postergación de salida">Problema mecánico o postergación de salida</option>
          </select>
        </div>

        {/* Information box */}
        <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <p className="leading-relaxed">
            Al confirmar, se reintegrarán <strong>S/. {seat.price.toFixed(2)}</strong> mediante <strong>{methodBadge.label}</strong> y el Asiento #{seat.number} quedará disponible en tiempo real en la app.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Devolución</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
