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
    key: '0nv0lrrknhotvqsqqsox',
    wsHost: 'localhost',
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          fetch('http://localhost:8000/broadcasting/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              callback(null, data);
            })
            .catch((error) => {
              console.error('Authorization error:', error);
              callback(error);
            });
        },
      };
    },
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
