import io from 'socket.io-client';
import BackendApi from '../Constant/Api';

export const socket = io(BackendApi, {
  withCredentials: true,
  transports: ['websocket'],
  autoConnect: true,
});
