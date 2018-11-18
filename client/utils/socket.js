import io from 'socket.io-client';


export const createSocketConnection = () => {
  const protocol = location.protocol;
  const host = location.host;

  return io(`${protocol}//${host}`);
};
