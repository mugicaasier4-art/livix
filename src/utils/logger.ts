/**
 * Logger utility that only outputs in development mode.
 * Prevents leaking stack traces and internal data to production console.
 */
export const logger = {
  error: (...args: unknown[]) => {
    if (import.meta.env.DEV) console.error(...args);
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.DEV) console.warn(...args);
  },
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) console.log(...args);
  },
};
