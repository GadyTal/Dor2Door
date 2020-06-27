import * as Sentry from "@sentry/browser";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn:
      "https://593380da95c44e41bedd3930c3298c8f@o376640.ingest.sentry.io/5197760",
  });
}
