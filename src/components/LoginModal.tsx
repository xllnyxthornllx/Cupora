import React, { useState, useRef, useEffect } from 'react'
import { UserAccount, UserRole } from '../types'
import { DEFAULT_USERS, getAllUsers, registerNewUser, setCurrentUser } from '../services/storageService'
import { X, Lock, Mail, User, Phone, IdCard, Bus, Shield, Smartphone, Eye, EyeOff, Check, ArrowRight, Sparkles } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: UserAccount) => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // Form states
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [dni, setDni] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('passenger')
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }
      setErrorMsg('')
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleQuickLogin = (user: UserAccount) => {
    setCurrentUser(user)
    onLoginSuccess(user)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')

    if (isRegisterMode) {
      if (!name.trim()) {
        setErrorMsg('Por favor ingresa tu nombre completo.')
        return
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Ingresa un correo electrónico válido.')
        return
      }

      const newAccount: UserAccount = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: selectedRole,
        dni: dni.trim() || '45918200',
        phone: phone.trim() || '987 654 321',
        assignedModelId: selectedRole === 'driver' ? 'renault-master-15' : undefined,
        assignedPlate: selectedRole === 'driver' ? 'Z4V-753' : undefined
      }

      const saved = registerNewUser(newAccount)
      onLoginSuccess(saved)
      onClose()
    } else {
      // Find matching user or fallback
      const all = getAllUsers()
      const found = all.find(u => u.email.toLowerCase() === email.trim().toLowerCase())

      if (found) {
        setCurrentUser(found)
        onLoginSuccess(found)
        onClose()
      } else {
        // Fallback create quick session
        const tempUser: UserAccount = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim().toLowerCase(),
          role: selectedRole
        }
        setCurrentUser(tempUser)
        onLoginSuccess(tempUser)
        onClose()
      }
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="p-0 bg-transparent w-[calc(100%-2rem)] max-w-md rounded-3xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-md shadow-2xl m-auto"
      aria-labelledby="login-title"
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
        <div className="text-center pb-4 border-b border-slate-800">
          <img src="/assets/logo.png" alt="Cupora" className="h-9 mx-auto object-contain mb-2" />
          <h3 id="login-title" className="text-lg font-bold text-white">
            {isRegisterMode ? 'Crear Cuenta en Cupora' : 'Iniciar Sesión en Cupora'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Accede como Pasajero, Chofer de Minivan o Despachador
          </p>
        </div>

        {/* Quick Demo Profiles (1-Click Login) */}
        {!isRegisterMode && (
          <div className="mt-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-teal-400 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Rápido para Demostración:</span>
            </span>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin(DEFAULT_USERS[0])}
                className="p-2 rounded-xl bg-slate-800 hover:bg-teal-950/60 border border-slate-700 hover:border-teal-500/60 text-slate-200 hover:text-teal-300 text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <Smartphone className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-[10px]">Pasajero</span>
                <span className="text-[9px] text-slate-400 truncate max-w-full">Juan Pérez</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(DEFAULT_USERS[1])}
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/60 text-slate-200 hover:text-emerald-300 text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <Bus className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-[10px]">Chofer</span>
                <span className="text-[9px] text-emerald-400 truncate max-w-full">Z4V-753</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(DEFAULT_USERS[2])}
                className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-[10px]">Despacho</span>
                <span className="text-[9px] text-slate-400 truncate max-w-full">Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Form complying with modern-web-guidance autofill-sign-in-form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {isRegisterMode && (
            <div>
              <label htmlFor="reg-name" className="block text-slate-300 font-medium mb-1">
                Nombre y Apellidos *
              </label>
              <div className="relative">
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Ej. Juan Carlos Mamani"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-teal-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-slate-300 font-medium mb-1">
              Correo Electrónico *
            </label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="username"
                spellCheck={false}
                enterKeyHint="next"
                placeholder="ejemplo@cupora.pe"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-white focus:outline-none focus:border-teal-500 font-mono"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-slate-300 font-medium mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                enterKeyHint="done"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 pr-9 text-white focus:outline-none focus:border-teal-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selection when registering */}
          {isRegisterMode && (
            <div className="space-y-1.5 pt-1">
              <span className="block text-slate-300 font-medium">¿Qué tipo de cuenta deseas?</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRole('passenger')}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    selectedRole === 'passenger'
                      ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Pasajero
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('driver')}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    selectedRole === 'driver'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Chofer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Despacho
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all mt-4 cursor-pointer"
          >
            <span>{isRegisterMode ? 'Completar Registro' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {isRegisterMode ? (
            <p>
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="text-teal-400 font-bold hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Aún no tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-teal-400 font-bold hover:underline"
              >
                Regístrate gratis
              </button>
            </p>
          )}
        </div>
      </div>
    </dialog>
  )
}
