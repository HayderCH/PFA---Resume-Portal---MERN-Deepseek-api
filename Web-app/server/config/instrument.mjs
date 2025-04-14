// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://32c0979425bb03d98783c20231a44e44@o4509124096491520.ingest.de.sentry.io/4509124102848592",
  integrations: [Sentry.mongooseIntegration()],
});