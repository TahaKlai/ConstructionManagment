/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly NG_APP_RECAPTCHA_SITE_KEY?: string;
  readonly NG_APP_RECAPTCHA_ENABLED?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
