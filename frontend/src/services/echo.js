import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export const createEcho = (token) => {
  if (echoInstance) {
    echoInstance.disconnect();
  }

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || '0nv0lrrknhotvqsqqsox',
    wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8090,
    wssPort: import.meta.env.VITE_REVERB_PORT || 8090,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    encrypted: false,
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  // Log de conexão
  echoInstance.connector.pusher.connection.bind('connected', () => {
    console.log('✅ WebSocket connected successfully');
  });

  echoInstance.connector.pusher.connection.bind('disconnected', () => {
    console.log('❌ WebSocket disconnected');
  });

  echoInstance.connector.pusher.connection.bind('error', (err) => {
    console.error('WebSocket error:', err);
  });

  console.log('Echo instance created with token');

  return echoInstance;
};

export const getEcho = () => echoInstance;

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
