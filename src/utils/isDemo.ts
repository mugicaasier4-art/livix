/**
 * Utility to detect if the application is running in "Demo Mode" (mock data enabled).
 *
 * Demo Mode is active if:
 * 1. Env var VITE_DEMO_MODE=true is set explicitly.
 * 2. Current hostname contains "demo" or "mock".
 */
export const isDemoMode = (): boolean => {
  if (import.meta.env.VITE_DEMO_MODE === 'true') return true;
  const hostname = window.location.hostname;
  return hostname.includes('demo') || hostname.includes('mock');
};

export default isDemoMode;
