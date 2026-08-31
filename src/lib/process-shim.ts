// A static browser bundle has no `process`, but some third-party dependencies
// still read `process.env`. Give them an empty stand-in before any module runs.
// Imported first from src/main.tsx.
const globalWithProcess = globalThis as typeof globalThis & {
  process?: { env: Record<string, string | undefined> };
};

if (!globalWithProcess.process) {
  globalWithProcess.process = { env: {} };
}

export {};
