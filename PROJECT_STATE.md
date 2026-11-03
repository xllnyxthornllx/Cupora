# 🚐 Cupora - Estado del Proyecto & Memoria de Sesión

> **Última actualización:** 3 de Noviembre de 2026  
> **Repositorio Oficial:** [https://github.com/xllnyxthornllx/Cupora](https://github.com/xllnyxthornllx/Cupora)  
> **Rama Principal:** `main`  
> **Directorio Local:** `C:\Users\A S U S\Cupora`

---

## 📋 Resumen del Proyecto

**Cupora** es una Progressive Web App (PWA) móvil y de escritorio para la gestión integral de reservas, venta de boletos con códigos QR, asignación dinámica de asientos y despacho interurbano de minivanes en tiempo real (rutas peruanas: Arequipa, Camaná, Chivay, Mollendo, Moquegua, etc.).

---

## 👥 Roles y Credenciales de Prueba

| Rol | Usuario / Correo | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- |
| **Pasajero** | `pasajero@cupora.pe` | `123456` | Ver croquis, seleccionar asientos, pagar con QR Yape/Plin, descargar boletos con código QR y ver historial de viajes. |
| **Conductor** | `chofer@cupora.pe` | `123456` | Ver lista de pasajeros en vivo, escanear boletos QR para abordar, registrar venta rápida en ventanilla y procesar devoluciones/reembolsos directos. |
| **Administrador** | `admin@cupora.pe` | `123456` | Crear y modificar minivanes, personalizar la disposición física de asientos, pasadizos y las 3 puertas en el croquis interactivo, ajustar tarifas y ver ingresos. |

---

## 📐 Arquitectura del Croquis Vehicular (Fluid Container Queries)

El sistema de asientos cuenta con una arquitectura de diseño adaptativa y realista:

1. **Aspect Ratio Vectorial (`aspect-[380/580]`):**
   - La carrocería conserva su proporción matemática tanto en pantallas ultra compactas (iPhone SE / Galaxy Fold) como en tabletas y pantallas de escritorio.
2. **Unidades de Contenedor CSS (`cqi`):**
   - Todos los elementos internos (asientos `14.5cqi`, puerta corrediza `15cqi`, puertas de cabina `12.5cqi x 10cqi`, portón trasero `26cqi x 6cqi` y chofer) escalan proporcionalmente con el ancho del vehículo, garantizando que nada se recorte o desborde.
3. **Selector Dual:**
   - Permite alternar entre **Croquis Minivan** (representación visual del vehículo) y **Lista de Asientos** (cuadrícula directa con botones grandes táctiles para mayor comodidad).
4. **Editor Visual de Asientos:**
   - Soporta drag-and-drop con soporte táctil (`touch-action: none`), alineación magnética automática en filas y columnas rectas (`Auto-Alinear en Filas Rectas`) y renumeración consecutiva (`Renumerar Asientos`).

---

## 📁 Estructura del Código

```text
Cupora/
├── index.html                           # Viewport fit cover, theme-color y PWA tags
├── public/
│   ├── manifest.json                    # Manifiesto PWA para instalación como app
│   └── assets/                          # Logotipo y favicon de Cupora
├── src/
│   ├── App.tsx                          # Enrutador principal, modales y barra de navegación
│   ├── main.tsx                         # Entrada de React 18
│   ├── types.ts                         # Interfaces de datos (Seat, Trip, MinivanModel, TicketData, UserAccount)
│   ├── components/
│   │   ├── Navbar.tsx                   # Barra superior y barra inferior flotante para móviles
│   │   ├── MinivanSeatMap.tsx           # Croquis proporcional fluido con CSS container queries
│   │   ├── MinivanLayoutBuilderModal.tsx# Diseñador de croquis con soporte táctil y alineación magnética
│   │   ├── QRScannerModal.tsx           # Escáner de boletos QR para el chofer
│   │   ├── TicketModal.tsx              # Boleto digital con código QR de embarque
│   │   ├── RefundModal.tsx              # Modal de confirmación de devoluciones y reembolsos
│   │   └── LoginModal.tsx               # Autenticación y registro de roles
│   ├── services/
│   │   └── storageService.ts            # Persistencia en localStorage (v5) y bus de sincronización
│   └── views/
│       ├── LandingView.tsx              # Portada mobile-first con accesos directos
│       ├── PassengerView.tsx            # Flujo de reserva con acordeón móvil y barra flotante de pago
│       ├── DriverView.tsx               # Cabina de control del conductor y check-in de boletos
│       └── AdminView.tsx                # Panel de control de flota, tarifas e ingresos
└── PROJECT_STATE.md                     # Memoria de sesión y estado actual
```

---

## ⚡ Comandos para Reanudar el Desarrollo

### 1. Iniciar Servidor Local de Desarrollo
```bash
cd "C:\Users\A S U S\Cupora"
npm run dev
```
- Acceso Local: `http://localhost:5173/`
- Acceso en tu Celular (misma red WiFi): `http://192.168.18.6:5173/`

### 2. Compilar para Producción y Validar Tipos
```bash
npm run build
```

### 3. Sincronizar Cambios con GitHub
```bash
git add .
git commit -m "feat: descripción de tus cambios"
git push origin main
```
