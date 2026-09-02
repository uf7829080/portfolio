/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional contact endpoint. See src/services/contactService.ts */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
