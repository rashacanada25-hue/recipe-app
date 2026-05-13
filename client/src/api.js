/** Dev: empty string + CRA `proxy`. Production: set `REACT_APP_API_URL` on the host. */
export const API_BASE = (() => {
  const fromEnv = process.env.REACT_APP_API_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, '');
  if (process.env.NODE_ENV === 'development') return '';
  return 'http://localhost:5000';
})();
