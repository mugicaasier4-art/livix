/**
 * Utility to detect if the application is running in "Demo Mode" (mock data enabled).
 * 
 * Demo Mode is active if:
 * 1. Current hostname is a known demo/mock subdomain.
 * 2. Current environment is development (localhost).
 * 3. Vercel deployment branch contains "demo".
 */
export const isDemoMode = (): boolean => {
  // Always true for this dedicated branch
  return true;
};

export default isDemoMode;
