HAB Telemetry Dashboard

A fault-tolerant telemetry acquisition and visualization platform built for High Altitude Balloon (HAB) missions. The system provides reliable telemetry collection, local buffering, automatic synchronization, secure access control, and real-time mission monitoring.

Live Deployment:
https://hab-dashboard-theta.vercel.app/dashboard

Access is restricted to authenticated and authorized team members.

System Overview

The platform consists of:

STM32-based flight computer
Ground station telemetry receiver
Automatic serial connection detection
Local SQLite buffering
Offline-first synchronization engine
Firebase Realtime Database
PostgreSQL historical storage
Cloud Functions
Next.js dashboard with live updates
Microsoft Azure AD authentication
Architecture
HAB Payload (STM32)
        │
        │ RF / LoRa
        ▼
Ground Station Software
        │
        ├── Auto COM Port Detection
        ├── SQLite Packet Buffer
        ├── Offline Queue System
        └── Automatic Retry Engine
        │
        ▼
Firebase Realtime Database
        │
        ├── Live Dashboard Updates
        │
        └── Cloud Function
                │
                ▼
          PostgreSQL Database
                │
                ▼
        Next.js Dashboard
                │
                ▼
       Azure AD Authentication
Key Features
Real-Time Telemetry Monitoring

Monitor:

Altitude
Temperature
Pressure
Humidity
UV Index
Magnetic Field
GPS Position
Battery Percentage
RSSI Signal Strength
IMU Data (Gyroscope + Accelerometer)
Ground Station Software

The ground station software automatically handles telemetry acquisition and reliability.

Automatic STM32 Detection
Detects serial COM ports automatically.
No manual port configuration required.
Recovers seamlessly after device reconnection.
Local SQLite Persistence

Incoming telemetry packets are first stored locally:

Prevents packet loss.
Allows operation without internet.
Provides local mission backup.
Offline-First Synchronization

Designed for unreliable field conditions.

When internet connectivity is unavailable:

Incoming Packet
      ↓
SQLite Queue
      ↓
Network Restored
      ↓
Automatic Retry
      ↓
Firebase Realtime Database

This ensures telemetry data is never lost during high-altitude missions.

Background Execution

Ground station processes are maintained using:

Windows Task Scheduler
Automatic startup
Recovery after reboot
Minimal operator intervention
Dashboard Features
Live Telemetry Dashboard

Built with:

Next.js 15
React
TypeScript
Tailwind CSS
Recharts
React Leaflet

Provides:

Header Panel

Displays:

HAB ID
Mission Time
Packet Number
RSSI
Status Flag
Camera Status
Sensor Cards

Live values for:

Altitude
Temperature
Pressure
Humidity
Battery
UV Index
Magnetic Field
Flight Map
OpenStreetMap integration
Real-time GPS position
Flight trajectory visualization
IMU Visualization

Displays:

Gyroscope X/Y/Z
Accelerometer X/Y/Z
Charts
Environment
Temperature
Pressure
Humidity
UV Index
Altitude
IMU
Gyroscope
Accelerometer
Magnetic Field
Signal
RSSI
Battery
Packet Log

View recently received telemetry packets.

Authentication & Security

Dashboard access is secured using:

Microsoft Azure Active Directory

Features:

College-domain restricted login
Authorized team-member access only
Identity management through Azure AD
Secure session handling
Database Architecture
Realtime Layer

Firebase Realtime Database

Used for:

Live telemetry streaming
Low-latency updates
Dashboard subscriptions
Historical Layer

PostgreSQL

Stores:

Historical telemetry packets
Long-term mission data
Analytics and chart history
Cloud Functions

Automatically move telemetry packets from:

Firebase RTDB
        ↓
Cloud Function
        ↓
PostgreSQL
Reliability Features

✅ Automatic STM32 serial detection

✅ Local SQLite packet buffering

✅ Offline-first queue architecture

✅ Automatic upload retry mechanism

✅ Reboot recovery using Windows Task Scheduler

✅ Realtime dashboard updates

✅ Historical PostgreSQL storage

✅ Secure Azure AD authentication

✅ Packet loss prevention

Tech Stack
Frontend
Next.js 15
React
TypeScript
Tailwind CSS
Recharts
React Leaflet
Backend
Firebase Realtime Database
Firebase Cloud Functions
PostgreSQL
SQLite
Next.js API Routes
Authentication
Microsoft Azure AD
Hardware Integration
STM32
Serial Communication
COM Port Auto Detection
Deployment
Vercel
Firebase
Future Improvements
Multi-HAB support
Mission replay mode
CSV export
Excel export
Predictive landing estimation
AI anomaly detection
Weather overlay
Mission event timeline
Remote command uplink
Project Goal

To provide a robust, fault-tolerant telemetry infrastructure for High Altitude Balloon missions, ensuring reliable packet acquisition, secure access, and uninterrupted telemetry visualization even under unstable connectivity conditions.
