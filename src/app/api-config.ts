/**
 * Central configuration for the API base URL.
 * Automatically uses the same hostname as the frontend, enabling access 
 * from localhost as well as network IP addresses sin depender de una IP fija.
 */
const getBaseUrl = () => {
  return 'https://backnegocios2026-896887579359.us-central1.run.app';
};

export const API_BASE_URL = getBaseUrl();
