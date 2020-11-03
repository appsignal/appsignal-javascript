/**
 * A map of npm modules to thier respective integrations.
 *
 * NOTE: don't forget to update this when a new integration is added!
 */
export const SUPPORTED_NODEJS_INTEGRATIONS: { [key: string]: string } = {
  express: "@appsignal/express",
  next: "@appsignal/nextjs",
  "apollo-server": "@appsignal/apollo-server",
  "apollo-server-express": "@appsignal/apollo-server"
}
