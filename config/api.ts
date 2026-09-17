/**
 * One place to change when the PHP REST API is introduced.
 * The first build intentionally uses local mock data and never calls this URL.
 */
export const API_CONFIG = {
  baseUrl: 'https://api.example.com/eagle-flame',
  timeoutMs: 15000,
  useMockData: true,
} as const;