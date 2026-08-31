import { registerRootComponent } from 'expo';
import App from './App';

// Filter benign React Native Web internal library warning in dev console
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes('pointerEvents') || args[0].includes('shadow*'))) {
    return;
  }
  originalWarn(...args);
};

registerRootComponent(App);
