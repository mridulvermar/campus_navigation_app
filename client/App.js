import React from 'react';
import { LogBox, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { SocketProvider } from './src/context/SocketContext';
import { NavigationProvider } from './src/context/NavigationContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Suppress benign internal library dev warnings
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  '"shadow*" style props are deprecated'
]);

// Web Font & Global Styling Injection for campus-glow-78 (Outfit + Sora + Manrope)
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // 1. Google Fonts: Outfit (400-900), Sora (400-800), Manrope (400-800), Plus Jakarta Sans
  if (!document.getElementById('campus-nav-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'campus-nav-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);
  }

  // 2. Global CSS overrides, font-face aliases, and rich campus-glow micro-animations
  if (!document.getElementById('campus-nav-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'campus-nav-styles';
    styleEl.innerHTML = `
      /* @font-face aliases to solve React Native Web quoted string quirks */
      @font-face {
        font-family: 'Outfit, system-ui, sans-serif';
        src: local('Outfit'), url('https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NJtEtq.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Sora, system-ui, sans-serif';
        src: local('Sora'), url('https://fonts.gstatic.com/s/sora/v12/xMQbuFFYT72XzQUp8a0.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Manrope, system-ui, sans-serif';
        src: local('Manrope'), url('https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2') format('woff2');
      }

      html, body, #root {
        background-color: #FAF8F5 !important;
        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        color: #24201D !important;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Global Manrope default for all RNW divs, texts, and inputs */
      div, span, p, input, select, textarea, button, [dir="auto"] {
        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        box-sizing: border-box;
      }

      /* Sora Display Typography for headers and display tags */
      h1, h2, h3, h4, 
      .font-display, 
      [data-font="sora"], 
      [style*="Sora"], 
      [style*='font-family: "Sora"'], 
      [style*="font-family: Sora"] {
        font-family: 'Sora', -apple-system, BlinkMacSystemFont, sans-serif !important;
        letter-spacing: -0.02em;
      }

      /* Text selection styling matching campus-glow warm amber */
      ::selection {
        background: rgba(234, 162, 40, 0.35) !important;
        color: #24201D !important;
      }

      /* Modern sleek scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: #FAF8F5;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(138, 130, 121, 0.28);
        border-radius: 9999px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(234, 162, 40, 0.65);
      }

      /* MICRO-ANIMATIONS FROM CAMPUS-GLOW-78 */

      /* 1. Pulsing Emerald Live Status Ring */
      @keyframes statusPulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
      }
      .live-pulse {
        animation: statusPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
      }

      /* 2. Radiant Amber Pulse Glow for Primary Badges & Routes */
      @keyframes amberGlow {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(234, 162, 40, 0.5);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(234, 162, 40, 0);
        }
      }
      .amber-pulse {
        animation: amberGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
      }

      /* 3. Shimmer Effect for Featured Cards */
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      .shimmer-card {
        background-size: 200% 100% !important;
        animation: shimmer 4s infinite linear !important;
      }

      /* 4. Gentle Float for Icons / Nodes */
      @keyframes floatSlow {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-3px);
        }
      }
      .float-animation {
        animation: floatSlow 3s ease-in-out infinite !important;
      }

      /* 5. Interactive Card Hover Lift & Border Illumination */
      .campus-hover-card {
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease !important;
      }
      .campus-hover-card:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 14px 28px -6px rgba(234, 162, 40, 0.16), 0 6px 12px -2px rgba(36, 32, 29, 0.05) !important;
        border-color: rgba(234, 162, 40, 0.45) !important;
      }

      /* 6. Button Active Press Scale */
      .campus-btn {
        transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease, filter 0.15s ease !important;
        cursor: pointer;
      }
      .campus-btn:hover {
        filter: brightness(1.04);
        box-shadow: 0 6px 18px -2px rgba(234, 162, 40, 0.38) !important;
      }
      .campus-btn:active {
        transform: scale(0.97) !important;
      }

      /* 7. Subtle Fade-In */
      @keyframes fadeInWarm {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fadeInWarm 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <NavigationProvider>
              <RootNavigator />
            </NavigationProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
