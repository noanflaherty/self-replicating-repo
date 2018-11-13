import io from 'socket.io-client';


export const createSocketConnection = () => {
  const protocol = location.protocol;
  const hostname = location.hostname;
  const port = location.port;

  return io(`${protocol}//${hostname}:${port}`);
};
