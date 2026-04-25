declare global {
  interface Window {
    plausible?: (eventName: string, options?: Record<string, unknown>) => void;
  }
}

export {};
