import { useEffect, useState } from "react";

export const useWebSocket = (connectionEndpoint: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectedSocket, setConnectedSocket] = useState<WebSocket | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const [onMessage, setOnMessage] = useState<
    (data: string, ws?: WebSocket) => void
  >((data) => () => {
    console.log(data);
  });
  const [onConnect, setOnConnect] = useState<
    (event: Event, ws?: WebSocket) => void
  >((data) => () => {
    console.log(data);
  });
  const [onDisconnect, setOnDisconnect] = useState<
    (event: Event, ws?: WebSocket) => void
  >((data) => () => {
    console.log(data);
  });

  const connect = () => {
    if (!isConnected && !connecting) {
      setConnecting(true);
    }
  };

  const sendMessage = (data: string) => {
    if (sending) {
      return false;
    }

    setSending(true);
    setMessage(data);
    return true;
  };

  useEffect(
    function connectSocket() {
      if (connecting) {
        setConnecting(false);
        console.log("connecting web socket");
        const webSocket = new WebSocket(connectionEndpoint);
        webSocket.onmessage = (event) => {
          onMessage(event.data, webSocket);
        };
        webSocket.onopen = (event) => {
          onConnect(event, webSocket);
        };
        webSocket.onclose = (event) => {
          onDisconnect(event, webSocket);
          setConnectedSocket(null);
          setIsConnected(false);
        };
        setConnectedSocket(webSocket);
        setIsConnected(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connecting, onMessage, onConnect, onDisconnect]
  );

  useEffect(
    function sendMessage() {
      if (message && isConnected && connectedSocket) {
        connectedSocket.send(message);
        setMessage(null);
        setSending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message]
  );

  return { connect, setOnMessage, setOnConnect, setOnDisconnect, sendMessage };
};
