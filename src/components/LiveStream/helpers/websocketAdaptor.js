// eslint-disable-next-line import/prefer-default-export
export class WebSocketAdaptor {
  constructor(initialValues) {
    Object.entries(initialValues).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
        this[key] = value;
      }
    });

    this.wsConn = new WebSocket(this.websocket_url);

    this.isWebSocketTriggered = true;

    this.connected = false;

    this.pingTimerId = -1;

    this.wsConn.onopen = () => {
      this.pingTimerId = setInterval(() => {
        this.sendPing();
      }, 3000);

      this.connected = true;
      this.callback({ data: { command: 'initialized' } });
    }

    this.wsConn.onmessage = (event) => this.callback(event)

    this.wsConn.onerror = (error) => {
      console.log(` error occured: ${JSON.stringify(error)}`);
      this.clearPingTimer();
      this.callbackError(error)
    }

    this.wsConn.onclose = (event) => {
      this.connected = false;
      if (this.debug) {
        console.log("connection closed.");
      }

      this.clearPingTimer();
      this.callback("closed", event);
    }
  }

  clearPingTimer() {
    if (this.pingTimerId !== -1) {
      if (this.debug) {
        console.debug("Clearing ping message timer");
      }
      clearInterval(this.pingTimerId);
      this.pingTimerId = -1;
    }
  }

  sendPing() {
    const jsCmd = { command: "ping" };
    this.wsConn.send(JSON.stringify(jsCmd));
  }

  close() {
    this.wsConn.close();
  }

  send(text) {
    if ([0, 2, 3].includes(this.wsConn.readyState)) {
      this.callbackError("WebSocketNotConnected");
      return;
    }
    this.wsConn.send(text);
  }

  isConnected() {
    return this.connected;
  }
}
