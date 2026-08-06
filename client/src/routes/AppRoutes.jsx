import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MapPage } from '../pages/MapPage';
import { NavigationPage } from '../pages/NavigationPage';
import { AssetsPage } from '../pages/AssetsPage';
import { BookingsPage } from '../pages/BookingsPage';
import { AdminPage } from '../pages/AdminPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { LostFoundPage } from '../pages/LostFoundPage';
import { EventsPage } from '../pages/EventsPage';
import { HelpCenterPage } from '../pages/HelpCenterPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/buildings" element={<MapPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/lost-found" element={<LostFoundPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
