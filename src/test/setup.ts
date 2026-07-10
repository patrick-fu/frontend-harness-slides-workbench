import "@testing-library/jest-dom/vitest";

// Node 25 exposes an incomplete experimental global localStorage when no
// backing file is configured. Use deterministic browser-shaped storage in
// jsdom instead of inheriting that process-level stub.
function createMemoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(String(key)) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(String(key)),
    setItem: (key, value) => values.set(String(key), String(value)),
  };
}

if (typeof window !== "undefined") {
  const local = createMemoryStorage();
  const session = createMemoryStorage();
  for (const target of [globalThis, window]) {
    Object.defineProperty(target, "localStorage", {
      configurable: true,
      value: local,
    });
    Object.defineProperty(target, "sessionStorage", {
      configurable: true,
      value: session,
    });
  }
}

// jsdom does not implement window.matchMedia — provide a minimal mock.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
