# Multi-Modal Campus Navigation and Facility Asset Booking Ecosystem Utilizing Real-Time Spatial Localization Analytics

An enterprise-grade, full-stack campus management and spatial analytics platform built using React 19, Vite, Tailwind CSS, Leaflet GIS, Node.js, Express.js, MongoDB, Mongoose, and Socket.IO.

---

## 🌟 Key Features & Core System Architecture

### 1. Smart Spatial Navigation & GIS Leaflet Maps
- **Interactive OpenStreetMap Rendering**: Custom SVG colored building markers for Academic, Research, Library, Sports, Dining, and Auditoriums.
- **Turn-by-Turn Guidance**: Haversine formula calculation for shortest pedestrian walking distance and ETA.
- **Emergency Exit Overlays**: Immediate identification of nearest floor exits and security call stations.
- **Real-Time User Spatial Tracking**: Simulated GPS pulse marker emitting live spatial location updates over WebSockets (Socket.IO).

### 2. Facility Booking & High-Value Asset Reservation
- **Multi-Category Asset Inventory**: Real-time reservation workflow for laptops, VR dev kits, drones, 3D printers, and projectors.
- **Facility Scheduling**: Book classrooms, auditoriums, seminar halls, sports grounds, and research cleanrooms.
- **QR Code Verification**: Automated generation of digital access tickets for turnstile and cabinet readers.
- **Role-Based Workflow**: Granular permission matrix for `Student`, `Faculty`, and `Administrator` roles.

### 3. Spatial Localization Telemetry & Analytics
- **Recharts Data Visualizations**: Daily visitor trends, peak hourly building density, popular facility breakdowns, and spatial telemetry heatmaps.

---

## 📁 Repository Folder Structure

```
navigation_app/
├── server/
│   ├── config/ (db.js)
│   ├── controllers/ (authController.js, buildingController.js, roomController.js, assetController.js, bookingController.js, analyticsController.js, notificationController.js, userController.js, extraController.js)
│   ├── middleware/ (authMiddleware.js, errorHandler.js)
│   ├── models/ (User.js, Building.js, Room.js, Asset.js, Booking.js, NavigationHistory.js, Notification.js, Event.js, LostFound.js)
│   ├── routes/ (authRoutes.js, buildingRoutes.js, roomRoutes.js, assetRoutes.js, bookingRoutes.js, analyticsRoutes.js, notificationRoutes.js, userRoutes.js, extraRoutes.js)
│   ├── utils/ (seedData.js, seedRunner.js)
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── client/
    ├── src/
    │   ├── api/ & services/ (api.js)
    │   ├── components/ (common/, landing/, map/, dashboard/, admin/, analytics/, booking/, navigation/)
    │   ├── context/ (AuthContext.jsx, ThemeContext.jsx, SocketContext.jsx, NavigationContext.jsx)
    │   ├── data/ (mockData.js)
    │   ├── layouts/ (MainLayout.jsx, AuthLayout.jsx)
    │   ├── pages/ (LandingPage, LoginPage, RegisterPage, DashboardPage, MapPage, NavigationPage, AssetsPage, BookingsPage, AdminPage, AnalyticsPage, NotificationsPage, ProfilePage, SettingsPage, LostFoundPage, EventsPage, HelpCenterPage, NotFoundPage)
    │   ├── routes/ (AppRoutes.jsx, ProtectedRoute.jsx)
    │   ├── styles/ (index.css with Glassmorphism & Leaflet overrides)
    │   ├── utils/ (geoUtils.js, formatters.js)
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm
- MongoDB running locally on port 27017 (optional; automatic fallback dataset built-in)

### 1. Launch Backend API Server
```bash
cd server
npm install
npm run seed     # (Optional) Seed MongoDB with sample university campus data
npm run dev      # Runs Express + Socket.IO server on http://localhost:5000
```

### 2. Launch Client Web App
```bash
cd client
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```

---

## 🔐 Demo Credentials (One-Click Login Buttons Available)

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@campus.edu` | `password123` |
| **Faculty** | `faculty@campus.edu` | `password123` |
| **Student** | `student@campus.edu` | `password123` |

---

## 📊 Database Design & Schemas

- **User**: Name, email, hashed password, role (`Student` | `Faculty` | `Administrator`), department, phone, profilePhoto.
- **Building**: Name, code, lat/lng coordinates, floor count, category, opening hours, emergency exits.
- **Room**: Room number, building ref, capacity, availability, current occupancy, category, facilities.
- **Asset**: Asset name, category, status (`Available` | `Reserved` | `In Use`), location, image, serial number.
- **Booking**: User ref, asset/room ref, date, start/end time, duration, purpose, status (`Pending` | `Approved` | `Rejected`), QR code string.
- **NavigationHistory**: User ref, source, destination, distance in meters, travel duration.
- **Notification**: Title, message, read flag, user ref, notification type.
