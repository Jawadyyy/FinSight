/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin of the deployed API. Empty in dev, where the Vite proxy handles it. */
  readonly VITE_API_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
