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
      this.callback("initialized");
    }

    this.wsConn.onmessage = (event) => {
      const obj = JSON.parse(event.data);

      if (obj.command === "start") {
        // this command is received first, when publishing so playmode is false

        if (this.debug) {
          console.debug("received start command");
        }

        this.webrtcadaptor.startPublishing(obj.streamId);
      } else if (obj.command === "takeCandidate") {
        if (this.debug) {
          console.debug(`received ice candidate for stream id ${obj.streamId}`);
          console.debug(obj.candidate);
        }

        this.webrtcadaptor.takeCandidate(obj.streamId, obj.label, obj.candidate);
      } else if (obj.command === "takeConfiguration") {
        if (this.debug) {
          console.log(`received remote description type for stream id: ${obj.streamId} type: ${obj.type}` );
        }
        this.webrtcadaptor.takeConfiguration(obj.streamId, obj.sdp, obj.type);
      } else if (obj.command === "stop") {
        console.debug("Stop command received");
        this.webrtcadaptor.closePeerConnection(obj.streamId);
      } else if (obj.command === "error") {
        this.callbackError(obj.definition);
      } else if (obj.command === "notification") {
        this.callback(obj.definition, obj);
        if (obj.definition === "play_finished" || obj.definition === "publish_finished") {
          this.webrtcadaptor.closePeerConnection(obj.streamId);
        }
      } else if (obj.command === "streamInformation") {
        this.callback(obj.command, obj);
      } else if (obj.command === "roomInformation") {
        this.callback(obj.command, obj);
      } else if (obj.command === "pong") {
        this.callback(obj.command);
      } else if (obj.command === "trackList") {
        this.callback(obj.command, obj);
      } else if (obj.command === "connectWithNewId") {
        this.multiPeerStreamId = obj.streamId;
        this.join(obj.streamId);
      } else if (obj.command === "peerMessageCommand") {
        this.callback(obj.command, obj);
      }
    }

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
