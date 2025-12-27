/**
 * Pakasir client configuration.
 * 
 * @remarks
 * You can obtain these credentials after creating a project in the Pakasir Dashboard.
 */
export interface ClientConfig {
  /** Project slug identifier */
  project: string;
  
  /** API key for authentication */
  api_key: string;
}