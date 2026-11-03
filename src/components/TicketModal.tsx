import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { TicketData } from '../types'
import { X, CheckCircle, Download, Printer, Share2, Bus, ShieldCheck } from 'lucide-react'

interface TicketModalProps {
  ticket: TicketData | null
  onClose: () => void
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [qrUrl, setQrUrl] = useState<string>('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (ticket) {
      if (!dialog.open) {
        dialog.showModal()
      }
      // Generate QR Code data URL
      QRCode.toDataURL(ticket.qrPayload, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then(url => setQrUrl(url))
        .catch(err => console.error(err))
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [ticket])

  if (!ticket) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="p-0 bg-transparent w-[calc(100%-2rem)] max-w-md rounded-3xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-md shadow-2xl open:animate-in open:fade-in open:zoom-in-95 m-auto"
      aria-labelledby="ticket-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden text-slate-100 shadow-2xl relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar boleto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 p-6 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/assets/logo.png" alt="Cupora" className="h-8 object-contain brightness-0 invert" />
          </div>
          <p className="text-teal-100 text-xs font-medium tracking-wide">
            BOLETO ELECTRÓNICO & PASE DE ABORDAJE
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pago Confirmado • Cero Sobreventa</span>
          </div>
        </div>

        {/* Ticket Body: Cutout design */}
        <div className="p-6 space-y-5">
          {/* Main Route & Seat Banner */}
          <div className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ruta Interurbana</p>
              <h3 id="ticket-title" className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>{ticket.origin.split(' ')[0]}</span>
                <span className="text-teal-400">➔</span>
                <span>{ticket.destination.split(' ')[0]}</span>
              </h3>
              <p className="text-xs text-teal-400 mt-1 font-mono">
                🕒 Salida: {ticket.departureTime} • {ticket.date}
              </p>
            </div>

            <div className="text-center pl-4 border-l border-slate-800">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Asiento</p>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-teal-500/30 mt-1">
                {ticket.seatNumber.toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Passenger & Vehicle Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Pasajero</span>
              <span className="font-semibold text-white block truncate">{ticket.passengerName}</span>
              <span className="text-slate-400 text-[11px]">DNI: {ticket.passengerDni}</span>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Minivan & Conductor</span>
              <span className="font-semibold text-teal-300 block truncate">Placa: {ticket.plate}</span>
              <span className="text-slate-400 text-[11px] block truncate">{ticket.driverName}</span>
            </div>
          </div>

          {/* QR Code Presentation */}
          <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-slate-200">
            {qrUrl ? (
              <img src={qrUrl} alt="Boleto QR" className="w-48 h-48 object-contain" />
            ) : (
              <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 animate-pulse text-xs">
                Generando código QR...
              </div>
            )}
            <p className="text-[11px] text-slate-700 font-mono font-medium mt-1">
              Código: {ticket.id}
            </p>
            <p className="text-[10px] text-slate-500 text-center mt-0.5">
              Muestra este código al conductor al momento de subir a la minivan.
            </p>
          </div>

          {/* Pricing Row */}
          <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-800/80 text-sm">
            <span className="text-slate-400">Total Abonado:</span>
            <span className="text-xl font-extrabold text-teal-400">S/. {ticket.price.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-teal-600/30"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Listo</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
