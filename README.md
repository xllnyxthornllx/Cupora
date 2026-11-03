<p align="center">
  <img src="public/assets/logo.png" alt="Cupora Logo" width="420">
</p>

<p align="center">
  <strong>Plataforma Integral de Reserva, Control de Aforo y Despacho Interurbano en Tiempo Real</strong>
  <br>
  <em>Diseñada a medida para el transporte interurbano en minivanes de Perú (Renault Master, Mercedes-Benz Sprinter, Toyota HiAce)</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-38bdf8?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-06b6d4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/PWA-Ready%20%26%20Mobile%20First-f59e0b?style=for-the-badge&logo=pwa" alt="PWA">
  <img src="https://img.shields.io/badge/Pagos%20Móviles-Yape%20%2F%20Plin%20QR-10b981?style=for-the-badge" alt="Yape Plin">
  <img src="https://img.shields.io/badge/QR%20Engine-Offline%20Camera%20Scanner-6366f1?style=for-the-badge" alt="QR Engine">
  <img src="https://img.shields.io/badge/Realtime-BroadcastChannel%20Bus-ec4899?style=for-the-badge" alt="BroadcastChannel">
</p>

---

## 🚐 ¿Qué es Cupora?

**Cupora** es una solución tecnológica de circuito cerrado creada para modernizar, ordenar y transparentar la venta de pasajes, el aforo y el despacho de minivanes y combis en rutas interurbanas de media distancia (ej. **Arequipa ➔ Camaná, Mollendo, Moquegua, Pedregal/El Majes**).

El sistema erradica la sobreventa en terminales y paraderos informales, digitaliza los manifiestos de pasajeros y permite la validación de boletos QR incluso en tramos de carretera sin cobertura de internet.

---

## ✨ Características Principales

### 1. 👤 Experiencia Pasajero (Enfocada en Compra Ágil)
* **Paso 1: Destino:** Selección intuitiva de la ruta y terminal de salida.
* **Paso 2: Minivan y Horario:** Selección de la unidad asignada con visualización de placa oficial (`Z4V-753`, `V9P-412`, etc.), conductor, tarifa y asientos libres en vivo.
* **Paso 3: Croquis Interactivo Realista:** Selección de butaca en un plano vehicular fiel a la realidad con pasadizos despejados.
* **Paso 4: Checkout con Yape y Plin:** Presentación del **código QR oficial en pantalla**, número de teléfono para transferencia inmediata y confirmación con código de operación.
* **Paso 5: Boleto Digital QR:** Generación inmediata del pase de abordaje firmado con código QR de alta resolución.
* **Cajón "Mis Boletos Activos":** Historial de boletos comprados con acceso directo a los códigos QR sin necesidad de reimprimir papel.

### 2. 🧑‍✈️ Cabina del Conductor / Chofer
* **Aforo en Tiempo Real:** Contador visual de asientos ocupados vs. disponibles.
* **Manifiesto Digital Oficial:** Tabla con nombres completos, DNI, teléfono, número de asiento y estado de pago de cada pasajero.
* **Escáner QR con Cámara (100% Offline):** Verificación instantánea de boletos mediante la cámara del celular sin consumir datos móviles.
* **Venta en Ventanilla Física:** Botón de cobro rápido en efectivo para pasajeros que abordan directamente en el terminal.
* **Motor de Reembolsos y Devoluciones:** Si un pasajero cancela su viaje, el chofer o despachador puede emitir un reembolso formal con motivo y monto; el asiento se libera automáticamente para que vuelva a estar disponible al instante en la app para todos los usuarios.
* **Personalizador de la Minivan:** Acceso directo para que el conductor configure y mueva las butacas según las modificaciones reales de su carrocería.

### 3. 🛠️ Panel de Administración y Despacho
* **Visión Global de Flota:** Monitoreo simultáneo de múltiples unidades en ruta o embarcando.
* **Métricas de Recaudación:** Desglose financiero en tiempo real entre ventas vía **App (Yape/Plin)** y ventas en **Ventanilla Física (Efectivo)**.
* **Constructor de Carrocería de Flota:** Diseñador completo de distribución para cualquier modelo de vehículo.

---

## 🎨 Croquis Realista y Constructor Magnético de Asientos

Las minivanes peruanas poseen carrocerías adaptadas con pasadizos únicos y diferentes cantidades de butacas. Cupora incorpora un motor visual automotriz avanzado:

### 🚪 Simulación de las 3 Puertas del Vehículo
1. **Puerta Chofer:** Puerta batiente frontal izquierda con manija y ángulo de apertura.
2. **Puerta Copiloto:** Puerta delantera derecha de acceso a las butacas de copiloto.
3. **Puerta Corrediza (Lateral Derecha):** Representación fiel con riel guía superior, indicador corredizo de subida y **estribo/escalón iluminado** para el abordaje de pasajeros.
4. **Portón Posterior / Bodega:** Compuerta trasera para la carga de maletas y bultos.

### 📐 Alineación Magnética Inteligente (`✨ Auto-Alinear`)
* **Pasadizo Natural:** El suelo del vehículo es un espacio abierto continuo; no existen cajas artificiales rotuladas como "Pasadizo".
* **Guías Magnéticas de Arrastre:** Al mover un asiento por el plano, este se acopla a las líneas de ventana, pasillo y filas.
* **Botón `Auto-Alinear en Filas Rectas`:** Un clic detecta las posiciones y las ajusta a filas rectas y parejas perfectamente ordenadas y simétricas.
* **Botón `🔢 Renumerar Asientos`:** Numera de forma secuencial (`#01` a `#N`) de adelante hacia atrás y de izquierda a derecha.
* **Plantillas Predeterminadas:**
  - *Renault Master 2.3 dCi* (17 Asientos - 3 Puertas).
  - *Mercedes-Benz Sprinter 315 Larga* (19 Asientos).
  - *Toyota HiAce Commuter* (12 Asientos).

### 🔍 Selector Interactivo de Tamaño de Asientos (Zoom)
Permite adaptar el tamaño visual de los cuadros de asiento tanto en la vista del pasajero como en el panel de diseño:
* **Chico (S - 48px):** Vista compacta para pantallas pequeñas o unidades con muchas butacas.
* **Normal (M - 56px):** Proporción estándar equilibrada.
* **Grande ⭐ (L - 66px - *Predeterminado*):** Asientos amplios y cómodos, con números `#01` en negrita, íconos grandes y tarifas legibles con un solo dedo.
* **XL (76px):** Máxima accesibilidad y amplitud táctil.

---

## ⚡ Sincronización en Tiempo Real Sin Servidor

Para permitir demostraciones fluidas sin costo de infraestructura previa, Cupora utiliza un **Bus de Sincronización Reactiva**:
* **`BroadcastChannel API` (`cupora_sync_bus_v4`):** Sincroniza al instante cualquier compra, bloqueo, venta en ventanilla o reembolso entre múltiples pestañas, ventanas y roles abiertos.
* **Persistencia Reactiva en `localStorage`:** Todos los cambios en la flota, rutas y pasajeros persisten de manera transparente.
* **Acceso Móvil en Red Local:** El servidor de desarrollo expone la app en la red WiFi (`http://<IP-LOCAL>:5173`) para interactuar desde celulares reales de clientes y choferes en paralelo.

---

## 🎨 Identidad Gráfica

Los activos oficiales del sistema se encuentran en [`public/assets/`](public/assets/):

| Recurso | Archivo | Utilidad |
| :--- | :--- | :--- |
| **Logo Completo** | [`public/assets/logo.png`](public/assets/logo.png) | Cabecera, landing page corporativa y comprobantes. |
| **Isotipo / App Icon** | [`public/assets/icon.png`](public/assets/icon.png) | Favicon, icono PWA para pantalla de inicio y avatares. |

---

## 📂 Estructura del Código

```text
Cupora/
├── public/
│   ├── assets/
│   │   ├── logo.png             # Logo corporativo Cupora
│   │   └── icon.png             # Isotipo para app / PWA
│   ├── favicon.ico
│   └── manifest.json            # Manifiesto para instalación como PWA
├── src/
│   ├── components/
│   │   ├── MinivanSeatMap.tsx   # Croquis interactivo con 3 puertas, pasadizo y selector de tamaño
│   │   ├── MinivanLayoutBuilderModal.tsx # Diseñador de carrocería con alineación magnética
│   │   ├── LoginModal.tsx       # Inicio de sesión con botones de prueba 1-clic (Pasajero, Chofer, Admin)
│   │   ├── RefundModal.tsx      # Modal de reembolso y liberación inmediata de asientos
│   │   ├── QRScannerModal.tsx   # Escáner de boletos offline con cámara en tiempo real
│   │   ├── TicketModal.tsx      # Boleto de viaje digital con código QR de embarque
│   │   └── Navbar.tsx           # Navegación reactiva adaptada al rol activo
│   ├── views/
│   │   ├── PassengerView.tsx    # Flujo de reserva (Destino ➔ Minivan ➔ Asiento ➔ Yape/Plin ➔ Boleto)
│   │   ├── DriverView.tsx       # Cabina operativa, manifiesto, escáner, ventanilla y reembolsos
│   │   └── AdminView.tsx        # Dashboard ejecutivo, ingresos (App vs. Ventanilla) y flota
│   ├── services/
│   │   └── storageService.ts    # Modelos peruanos, persistencia, bus BroadcastChannel y autenticación
│   ├── types/
│   │   └── index.ts             # Definiciones TypeScript (Seat, MinivanModel, Trip, TicketData, UserAccount)
│   ├── App.tsx                  # Enrutamiento por roles, toasts y listeners globales
│   ├── main.tsx
│   └── index.css                # Estilos Tailwind CSS
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Instalación y Puesta en Marcha Local

### 1. Requisitos Previos
* **Node.js** (versión 18 o superior recomendada).
* **npm** o **pnpm**.
* **Git**.

### 2. Clonar el repositorio
```bash
git clone https://github.com/xllnyxthornllx/Cupora.git
cd Cupora
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación quedará disponible en:
* **Entorno local:** [http://localhost:5173/](http://localhost:5173/)
* **Entorno red local (móviles):** `http://<TU_IP_LOCAL>:5173/` (se muestra en la consola al iniciar Vite).

### 5. Compilación para producción (Build Check)
```bash
npm run build
```
Genera la distribución optimizada y valida que no existan errores de TypeScript ni de empaquetado.

---

## 👥 Cuentas de Demostración Rápida (1-Clic)

El sistema incluye un botón de inicio de sesión rápido en la esquina superior derecha con perfiles precargados:

* **👤 Pasajero:** `pasajero@cupora.pe` — Permite reservar asientos, pagar con Yape/Plin y ver sus boletos.
* **🧑‍✈️ Chofer:** `victor@cupora.pe` — Unidad asignada `Z4V-753` (Renault Master). Accede al manifiesto, escáner QR, ventas en ventanilla, reembolsos y editor de su minivan.
* **🛠️ Administrador:** `admin@cupora.pe` — Control total de ingresos, flota y configuración general.

---

<p align="center">
  Hecho con ❤️ para modernizar el transporte interurbano en el Perú.
  <br>
  <strong>Cupora Platform © 2026</strong>
</p>
