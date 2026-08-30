// The generated Supabase client keeps a `process.env` fallback from the old SSR
// setup. A static browser bundle has no `process`, so give it an empty stand-in
// before any module reads it. Imported first from src/main.tsx.
const globalWithProcess = globalThis as typeof globalThis & {
  process?: { env: Record<string, string | undefined> };
};

if (!globalWithProcess.process) {
  globalWithProcess.process = { env: {} };
}

export {};
