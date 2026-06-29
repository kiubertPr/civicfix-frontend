// src/config.js

const config = {
  backendUrl: window.APP_CONFIG?.BACKEND_URL || "",
  googleClientId: window.APP_CONFIG?.GOOGLE_CLIENT_ID || "",
  mapboxToken: window.APP_CONFIG?.MAPBOX_ACCESS_TOKEN || "",
};

export default config;