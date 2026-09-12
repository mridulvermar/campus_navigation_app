# 🚀 CampusNav Full-Stack Deployment Guide

This guide provides a step-by-step walkthrough to deploy the complete **Campus Navigation & Facility Asset Booking Platform** to the cloud for free.

---

## 🏗 Architecture Overview

| Component | Technology | Recommended Host | Free Tier Available? |
| :--- | :--- | :--- | :--- |
| **Database** | MongoDB Cloud Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | ✅ Yes (M0 Free Cluster) |
| **Backend API** | Node.js / Express / Socket.io | [Render](https://render.com) or [Railway](https://railway.app) | ✅ Yes |
| **Frontend Web App** | React Native Web / Expo | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | ✅ Yes |

---

## 📌 STEP 1: Set Up MongoDB Atlas (Cloud Database)

1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create a Cluster**:
   - Choose **M0 (Free Shared)**.
   - Provider: **AWS**, Region: closest to your users (e.g., `ap-south-1` Mumbai or `us-east-1`).
3. **Create Database User**:
   - Username: `admin` (or custom name).
   - Password: generate a secure password (save this!).
4. **Configure Network Access**:
   - Go to **Network Access** → **Add IP Address**.
   - Select **Allow Access from Anywhere (`0.0.0.0/0`)** so your cloud backend can connect.
5. **Get Connection String**:
   - Click **Connect** → **Drivers** → Node.js.
   - Copy connection string:
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/campus_navigation?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password.

---

## 📌 STEP 2: Deploy Backend to Render

1. Go to [Render.com](https://render.com) and sign in with your GitHub account.
2. Click **New +** → **Web Service**.
3. Connect your repository: `mridulvermar/campus_navigation_app`.
4. Configure the Web Service:
   - **Name**: `campus-nav-server` (or any preferred name).
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. **Set Environment Variables** (under *Advanced* / *Environment Variables*):
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGO_URI` = `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/campus_navigation?retryWrites=true&w=majority`
   - `JWT_SECRET` = `your_super_secret_jwt_key_2026`
   - `GEMINI_API_KEY` = `your_gemini_api_key_from_google_ai_studio` *(Get free from https://aistudio.google.com/app/apikey)*
   - `CLIENT_URL` = `*` (or your frontend Vercel URL once deployed)
6. Click **Create Web Service**.
7. Render will build and deploy your API. Once deployed, note down your backend URL:
   ```
   https://campus-nav-server.onrender.com
   ```
   *(Test in browser: `https://campus-nav-server.onrender.com/api/health`)*

---

## 📌 STEP 3: Deploy Frontend to Vercel (Recommended)

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New…** → **Project**.
3. Select your repository: `campus_navigation_app`.
4. Configure the project:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click `Edit` and select `client`.
   - **Build and Output Settings**:
     - **Build Command**: `npx expo export -p web`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
5. **Add Environment Variable**:
   - Name: `EXPO_PUBLIC_API_URL`
   - Value: `https://campus-nav-server.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **Deploy**.
7. In ~1-2 minutes, your live web application will be accessible at:
   ```
   https://campus-navigation-app.vercel.app
   ```

---

## 📌 STEP 4: (Optional) Seed Database on Cloud

If you want to populate your cloud database with all 428 rooms, campus buildings, and assets:

In your local terminal (connected to cloud Mongo URI in `server/.env`):
```bash
cd server
npm run seed
```
Or open the Render Web Service Shell and execute:
```bash
node utils/seedRunner.js
```

---

## 📌 STEP 5: Convert Application into Android APK (.apk)

Because the project is built with **Expo & React Native**, you can build a standalone installable Android APK (`.apk`) using **EAS (Expo Application Services) Cloud Build** (recommended, zero Android Studio setup required) or **Local Native Gradle Build**.

### 🌟 Method A: EAS Cloud Build (Recommended & Easiest)

EAS compiles your `.apk` in the cloud on Expo's high-performance build servers and gives you a direct download link and QR code to install on any Android phone.

1. **Install EAS CLI globally**:
   ```bash
   npm install -g eas-cli
   ```

2. **Navigate to the client directory**:
   ```bash
   cd client
   ```

3. **Login to Expo** (create a free account at [expo.dev](https://expo.dev) if you don't have one):
   ```bash
   npx eas-cli login
   ```

4. **Initialize Project ID**:
   ```bash
   npx eas-cli project:init
   ```

5. **Ensure your live Render backend is linked** in `client/.env`:
   ```env
   EXPO_PUBLIC_API_URL=https://your-backend-service.onrender.com/api
   ```

6. **Trigger the standalone APK Build**:
   ```bash
   npx eas-cli build --platform android --profile preview
   ```
   *(The `preview` profile is already configured in `client/eas.json` with `"buildType": "apk"`).*

7. **Download & Install**:
   - Once the build finishes (~3-5 mins), EAS will display a direct **Download URL** and **QR code**.
   - Open the link or scan the QR code on any Android device to download and install `campus-navigation.apk`!

---

### 💻 Method B: Local Gradle Build (Requires Android Studio & Android SDK)

If you have Android Studio and the Android SDK installed locally on your computer:

1. **Navigate to `client/`**:
   ```bash
   cd client
   ```

2. **Generate the native Android project**:
   ```bash
   npx expo prebuild --platform android
   ```

3. **Build the Release APK with Gradle wrapper**:
   - On Windows PowerShell:
     ```powershell
     cd android
     .\gradlew.bat assembleRelease
     ```
   - On Mac/Linux:
     ```bash
     cd android
     ./gradlew assembleRelease
     ```

4. **Locate your generated APK file**:
   ```
   client/android/app/build/outputs/apk/release/app-release.apk
   ```
   Transfer this `.apk` file to your Android phone via USB, Google Drive, or WhatsApp, and tap to install!

---

## 💡 Quick Health Check

- ✅ **Backend Health**: `https://<your-render-url>/api/health`
- ✅ **Frontend Web App**: `https://<your-vercel-url>`
- ✅ **Android APK**: Download and run `.apk` on any Android device.
- ✅ **Login Test**: Sign in with `admin@campus.edu` / `password123` or click `Continue as Campus Visitor`.
- ✅ **Dijkstra Road Navigation**: Open any event or room and click "Navigate".
