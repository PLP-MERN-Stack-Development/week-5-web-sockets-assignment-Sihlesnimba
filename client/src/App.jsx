import ChatRoom from "./components/ChatRoom";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");

function App() {
  return (
    <div>
      <ChatRoom />
    </div>
  );
}

export default App;
