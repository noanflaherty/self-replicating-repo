import io from 'socket.io-client';
import { clientConfig } from '../clientConfig'; // Import config to get location

const protocol = location.protocol;
const hostname = location.hostname;
const port = location.port;


const socket = io(`${protocol}//${hostname}:${port}`);
export default socket;
