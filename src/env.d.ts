/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare const Astro: Readonly<import("astro").AstroGlobal>;

declare global {
  interface SDKTypeMode {
    strict: true;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly BASE_NAME: string;
    readonly MONGODB_URI?: string;
    readonly MONGODB_DB_NAME?: string;
    /** Gmail login (or any SMTP user) */
    readonly GMAIL_USER?: string;
    /** Gmail App Password (16 chars) — prefer SMTP_* for other providers */
    readonly GMAIL_APP_PASSWORD?: string;
    readonly SMTP_HOST?: string;
    readonly SMTP_PORT?: string;
    readonly SMTP_SECURE?: string;
    readonly SMTP_USER?: string;
    readonly SMTP_PASS?: string;
    readonly MAIL_FROM?: string;
    readonly MAIL_TO?: string;
  }
}

declare module "react-router-dom" {
  interface RouteMetadata {
    pageIdentifier?: string;
  }

  export interface IndexRouteObject {
    routeMetadata?: RouteMetadata;
  }
  export interface NonIndexRouteObject {
    routeMetadata?: RouteMetadata;
  }
}
