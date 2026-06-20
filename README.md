# High Altitude Balloon Satellite

> A fault-tolerant telemetry acquisition and visualization platform built for High Altitude Balloon (HAB) missions — engineered to keep working when the signal doesn't.

[![Live Dashboard](https://img.shields.io/badge/demo-live-success)](https://hab-dashboard-theta.vercel.app/dashboard)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![Auth](https://img.shields.io/badge/auth-Azure%20AD-0078D4)](https://azure.microsoft.com/)

**[🚀 Live Demo](https://hab-dashboard-theta.vercel.app/dashboard)** &nbsp;·&nbsp; **[📡 Report an Issue](../../issues)** &nbsp;·&nbsp; Access restricted to authenticated team members

---

## Why this exists

At 30,000m, you don't get a second chance at a dropped packet. Ground stations lose internet, payloads spin out of solar alignment, and batteries die at the worst moment. This platform was built around one question:

> **What happens when the balloon loses connectivity — and how do we make sure we never lose the data?**

Every architectural decision below traces back to that question.

---

## System Overview

| Layer | Responsibility |
|---|---|
| 🛰️ **STM32 Flight Computer** | Onboard sensor sampling + RF/LoRa downlink |
| 🖥️ **Ground Station Software** | Auto serial detection, local buffering, offline-first sync |
| 🔥 **Firebase Realtime Database** | Live packet streaming to the dashboard |
| 🐘 **PostgreSQL** | Durable historical storage for analytics & replay |
| ⚡ **Cloud Functions** | Bridges Realtime DB → PostgreSQL automatically |
| 📊 **Next.js Dashboard** | Live mission control UI |
| 🔐 **Azure AD** | College-domain-restricted authentication |

---

## Architecture

```
                    ┌─────────────────────┐
                    │   HAB Payload        │
                    │   (STM32)             │
                    └──────────┬───────────┘
                               │ RF / LoRa
                               ▼
                 ┌─────────────────────────────┐
                 │   Ground Station Software     │
                 │                                │
                 │  ① Auto COM Port Detection      │
                 │  ② SQLite Packet Buffer         │
                 │  ③ Offline Queue System         │
                 │  ④ Automatic Retry Engine       │
                 └──────────────┬─────────────────┘
                                │ upload (when online)
                                ▼
                 ┌─────────────────────────────┐
                 │  Firebase Realtime Database   │
                 └───────┬─────────────┬─────────┘
                         │             │
              live push  │             │  onValueCreated
                         ▼             ▼
              ┌────────────────┐  ┌──────────────────┐
              │ Next.js         │  │  Cloud Function    │
              │ Dashboard       │  │  (RTDB → SQL)       │
              │ (live updates)  │  └─────────┬────────────┘
              └───────┬─────────┘             ▼
                      │              ┌──────────────────┐
                      │              │   PostgreSQL        │
                      │              │ (historical store)   │
                      │              └─────────┬────────────┘
                      │                         │
                      │     API route (history) │
                      └─────────────◄────────────┘
                                │
                                ▼
                   ┌─────────────────────────┐
                   │  Azure AD Authentication  │
                   │  (college-domain only)     │
                   └───────────────────────────┘
```

**The core design principle:** telemetry should never be lost, even if every network link in this diagram fails simultaneously. SQLite on the ground station is the safety net underneath everything else.

---

## ✨ Key Features

### 📡 Ground Station Reliability
- **Automatic STM32 detection** — scans and connects to the correct serial COM port with zero manual configuration, and recovers seamlessly after a device reconnect
- **Local SQLite persistence** — every incoming packet is written locally *first*, before any network call is attempted, so a dead connection never means a dead packet
- **Offline-first sync engine** — when the internet drops, packets queue in SQLite; once connectivity returns, a retry engine automatically drains the queue into Firebase
- **Reboot recovery via Windows Task Scheduler** — the ground station process restarts itself automatically after a crash or reboot, with minimal operator babysitting required during a live flight

```
Incoming Packet → SQLite Queue → [waiting for network] → Network Restored → Automatic Retry → Firebase Realtime DB
```

### 📊 Live Mission Dashboard
| Panel | Shows |
|---|---|
| **Header bar** | HAB ID, mission time, packet #, status flag, RSSI, camera status |
| **Sensor cards** | Live altitude, temperature, pressure, humidity, UV index, magnetic field, battery |
| **Flight map** | Real-time GPS position + flight trajectory on OpenStreetMap |
| **IMU panel** | Gyroscope (X/Y/Z) and accelerometer (X/Y/Z) bidirectional bars |
| **Charts** | Environment · IMU · Signal — tabbed time-series views via Recharts |
| **Packet log** | Last 10 raw telemetry packets, inspectable in a table |

### 🚨 Automated Alerts
- 🔴 Battery below 15%
- 🔴 UV Index above 10
- 🔴 RSSI below −90 dBm (signal lost)
- 🟡 RSSI between −70 and −90 dBm (marginal signal)

### 🔐 Authentication & Access Control
Dashboard access is gated behind **Microsoft Azure Active Directory**, restricted to college-domain accounts — only verified team members can view live mission data. Session handling and identity management are fully delegated to Azure AD rather than hand-rolled.

---

## 🧩 Sample Telemetry Packet

```json
{
  "HAB_ID": "HAB-01",
  "MISSION_TIME": "00:12:34",
  "PACKET_NO": 42,
  "TEMPERATURE": -23.5,
  "PRESSURE": 512.3,
  "HUMIDITY": 34.2,
  "UV_INDEX": 7.1,
  "MAGNETIC_FIELD": 44.8,
  "LATITUDE": 19.0760,
  "LONGITUDE": 72.8777,
  "ALTITUDE": 12500,
  "TIMESTAMP": "2026-06-20T12:00:00Z",
  "BATTERY_PERCENT": 78,
  "GYRO_X": 1.23,
  "GYRO_Y": -0.45,
  "GYRO_Z": 0.12,
  "ACCEL_X": 0.03,
  "ACCEL_Y": -0.01,
  "ACCEL_Z": 9.81,
  "CAMERA_STATUS": "ON",
  "STATUS_FLAG": "OK",
  "RSSI": -72
}
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="25%">

**Frontend**
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Recharts
- React Leaflet

</td>
<td valign="top" width="25%">

**Backend**
- Firebase Realtime DB
- Firebase Cloud Functions
- PostgreSQL
- SQLite
- Next.js API Routes

</td>
<td valign="top" width="25%">

**Auth**
- Microsoft Azure AD
- College-domain restricted login
- Secure session handling

</td>
<td valign="top" width="25%">

**Hardware**
- STM32
- Serial / UART communication
- RF / LoRa downlink
- Auto COM port detection

</td>
</tr>
</table>

**Deployment:** Vercel (frontend) · Firebase (functions + realtime DB)

---

## 🚀 Quick Start

### 1. Clone & install
```bash
git clone <repo-url>
cd hab-dashboard
npm install
```

### 2. Set up Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com) → create a project
2. Enable **Realtime Database** (start in test mode)
3. **Project Settings → Your Apps** → Add a Web App → copy the config

### 3. Set up PostgreSQL (Cloud SQL)
1. Firebase Console → **Build → Cloud SQL**
2. Create a **PostgreSQL** instance
3. Create a database named `hab_telemetry`
4. Note the connection string

### 4. Configure environment variables
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

DATABASE_URL=
```

### 5. Run the dashboard
```bash
npm run dev
# → http://localhost:3000
```

### 6. Test without hardware
```bash
node simulator.js
```
Packets stream into the dashboard immediately — useful for UI work or demos when the payload isn't physically connected.

---

## ☁️ Deployment

```bash
# Frontend → Vercel
vercel deploy

# Cloud Functions → Firebase
firebase deploy --only functions
```

The deployed `onNewTelemetry` function fires automatically on every new write to `/telemetry` in Realtime DB and persists the row into PostgreSQL — no manual sync step required.

---

## 📁 Project Structure

```
hab-dashboard/
├── app/
│   ├── layout.tsx              # Root layout + fonts
│   ├── globals.css             # Dark space-mission aesthetic
│   ├── page.tsx                # Redirects → /dashboard
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard UI
│   └── api/
│       └── telemetry/
│           └── route.ts        # GET/POST API for PostgreSQL
├── components/
│   ├── Header.tsx               # Mission status bar
│   ├── StatCard.tsx             # Individual sensor value card
│   ├── charts/
│   │   └── TelemetryChart.tsx   # Recharts wrapper
│   ├── gauges/
│   │   ├── CircularGauge.tsx    # SVG circular gauge
│   │   └── IMUDisplay.tsx       # Gyro/accel bar display
│   └── map/
│       └── GPSMap.tsx           # Leaflet flight path map
├── lib/
│   ├── firebase.ts              # Firebase client setup
│   ├── db.ts                    # PostgreSQL pool + helpers
│   ├── types.ts                 # TelemetryPacket types
│   └── useTelemetry.ts          # React hook for realtime data
├── functions/
│   └── index.js                 # Cloud Function: RTDB → PostgreSQL
├── simulator.js                  # Test data generator
├── firebase.json
├── database.rules.json
├── .env.local
└── README.md
```

---

## 🧪 Reliability Checklist

This is the part of the project that mattered most — the dashboard is the visible 10%, this is the other 90%:

- ✅ Automatic STM32 serial detection
- ✅ Local SQLite packet buffering (write-first, network-second)
- ✅ Offline-first queue architecture
- ✅ Automatic upload retry on reconnect
- ✅ Reboot recovery via Windows Task Scheduler
- ✅ Real-time dashboard updates
- ✅ Durable PostgreSQL historical storage
- ✅ Azure AD–secured access
- ✅ Zero packet loss under unstable connectivity

---

## 🩹 Troubleshooting

<details>
<summary><strong>Dashboard shows "AWAITING TELEMETRY SIGNAL..."</strong></summary>

- Check Firebase config in `.env.local`
- Confirm Realtime Database is enabled in the Firebase Console
- Run `node simulator.js` to confirm the dashboard pipeline works end-to-end with synthetic data
</details>

<details>
<summary><strong>Map isn't loading</strong></summary>

- Leaflet is client-side only — this is expected during server-side rendering
- The map mounts after hydration completes
</details>

<details>
<summary><strong>PostgreSQL connection error</strong></summary>

- Local dev: set `DB_HOST=localhost` and confirm PostgreSQL is running
- Production: use the Cloud SQL socket path, not a direct host
</details>

---

## 🗺️ Future Improvements

- [ ] Multi-HAB support (track multiple payloads simultaneously)
- [ ] Mission replay mode
- [ ] CSV / Excel export
- [ ] Predictive landing estimation
- [ ] AI-based anomaly detection on incoming telemetry
- [ ] Weather overlay on the flight map
- [ ] Mission event timeline
- [ ] Remote command uplink

---

## 🎯 Project Goal

To provide a robust, fault-tolerant telemetry infrastructure for High Altitude Balloon missions — ensuring reliable packet acquisition, secure access, and uninterrupted visualization even under unstable field connectivity.

---

<div align="center">

**[🚀 View Live Dashboard](https://hab-dashboard-theta.vercel.app/dashboard)**

*Access restricted to authenticated and authorized team members.*

</div>
