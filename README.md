# Multi-Modal Campus Navigation & Facility Booking Ecosystem

An enterprise-grade, full-stack campus management and spatial analytics platform built with **React Native (Expo)**, **Node.js**, **Express.js**, **MongoDB**, **Socket.IO**, and **Leaflet GIS Routing Engine**.

---

## 🌟 Key Features & Core System Architecture

### 1. Smart Spatial Navigation & GIS Leaflet Maps
- **Google Hybrid Satellite & Street Layer Modes**: 100% cloud-free satellite imagery & OpenStreetMap tile rendering.
- **320-Junction Road Graph Dijkstra Engine**: True road network Dijkstra routing that strictly avoids shortcuts through building walls.
- **428 Classrooms & Labs Search**: Indexed campus directory with building, floor, and room name lookup.
- **Dual Navigation Mode**: Walk (pedestrian) and Drive (vehicle) road routing modes.
- **Live User Spatial GPS Marker**: Real-time user location pulsing marker with Socket.IO live sync.

### 2. Facility Booking & High-Value Asset Reservation
- **428 Classrooms & Labs**: Reserve lecture halls, computer laboratories, seminar rooms, and project halls.
- **Instant Digital Access Pass**: Automated generation of digital access passes with verifiable QR codes.
- **Multi-Category Asset Tracking**: RFID & inventory tracking for high-value laboratory equipment, VR dev kits, and laptops.
- **Role-Based Workflows**: Tailored views and permissions for `Student`, `Faculty`, and `Administrator`.

### 3. Spatial Localization Telemetry & Analytics
- **Live Footfall & Peak Hours**: Hourly occupancy trajectories, dwell time analysis, and zone congestion heatmaps.
- **Campus Safety & Emergency SOS**: Instant 24/7 one-touch emergency response broadcasting GPS coordinates.

---

## 📁 Architecture Overview

```
campus_navigation_app/
├── server/                               # Unchanged Express & Socket.IO backend
│   ├── config/ (db.js)
│   ├── controllers/ (auth, building, room, asset, booking, analytics, etc.)
│   ├── middleware/ (authMiddleware, errorHandler)
│   ├── models/ (User, Building, Room, Asset, Booking, etc.)
│   ├── routes/ (auth, building, room, asset, booking, analytics, etc.)
│   ├── package.json
│   └── server.js
│
└── client/                               # React Native (Expo) Cross-Platform App
    ├── App.js                            # Root App with Providers & Safe Area
    ├── index.js                          # Expo Root Register
    ├── app.json                          # Expo Config
    ├── metro.config.js                   # Metro Bundler Config
    ├── package.json
    └── src/
        ├── components/
        │   ├── common/ (GlassCard, Badge, StatCard, WeatherWidget, EmergencyWidget, QRModal, HeaderBar)
        │   └── map/ (CampusMap, InteractiveCampusMap, FloatingNavPanel)
        ├── context/ (AuthContext, NavigationContext, SocketContext, ThemeContext)
        ├── data/ (campus_graph.json, geolocations_graph.json, mockData.js)
        ├── navigation/ (RootNavigator with Bottom Tabs & Stack)
        ├── screens/
        │   ├── LandingScreen.js
        │   ├── LoginScreen.js
        │   ├── RegisterScreen.js
        │   ├── DashboardScreen.js
        │   ├── MapScreen.js
        │   ├── NavigationScreen.js
        │   ├── BookingsScreen.js
        │   ├── AssetsScreen.js
        │   ├── AnalyticsScreen.js
        │   ├── NotificationsScreen.js
        │   ├── LostFoundScreen.js
        │   ├── EventsScreen.js
        │   ├── HelpCenterScreen.js
        │   ├── ProfileScreen.js
        │   ├── SettingsScreen.js
        │   └── AdminScreen.js
        ├── services/ (api.js, mapEngine/)
        └── theme/ (colors.js)
```

---

## 🚀 Quick Start Guide

### 1. Launch Backend Server (Port 5000)
```bash
cd server
npm run dev
```

### 2. Launch React Native Frontend (Mobile & Web)
```bash
cd client

# Run on Web (Browser)
npm run web
# or: npm run dev

# Run on Android Emulator / Physical Device
npm run android

# Run on iOS Simulator / Physical Device
npm run ios
```

---

## 🔐 Demo Credentials (One-Click Quick Login)

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@campus.edu` | `password123` |
| **Faculty** | `faculty@campus.edu` | `password123` |
| **Student** | `student@campus.edu` | `password123` |
