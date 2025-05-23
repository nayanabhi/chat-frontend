import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT as string, {
  autoConnect: false, // connect manually
  reconnection: true, // allow reconnection after server restarts
  auth: {
    token:
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "",
  },
});

export default socket;
