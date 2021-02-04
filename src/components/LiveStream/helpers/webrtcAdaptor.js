/* eslint-disable import/prefer-default-export */
import { PeerStats } from './peerStats';

export class WebRTCAdaptor {
  constructor(initialValues) {
    this.peerconnection_config = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }]};
    this.sdp_constraints = { OfferToReceiveAudio: true, OfferToReceiveVideo: true };
    this.remotePeerConnection = [];
    this.remotePeerConnectionStats = [];
    this.remoteDescriptionSet = [];
    this.iceCandidateList = []
    this.roomName = null;
    this.videoTrackSender = null;
    this.audioTrackSender = null;
    this.playStreamId = [];
    this.micGainNode = null;
    this.localStream = null;
    this.bandwidth = 900; // default bandwidth kbps
    this.isMultiPeer = false; // used for multiple peer client
    this.multiPeerStreamId = null; // used for multiple peer client
    this.roomTimerId = -1;
    this.isWebSocketTriggered = false;
    this.webSocketAdaptor = null;
    this.isPlayMode = true;
    this.debug = false;
    this.composedStream = new MediaStream();
    this.publishMode = "camera";
    // defaulting with video and audio false as we want view only exp for now
    this.mediaConstraints = { video: false, audio: false };
    this.videoContainer = null;
    this.candidateTypes = ["udp", "tcp"];
    this.desktopStream = null;
    this.isInitialized = false;

    Object.entries(initialValues).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
        this[key] = value;
      }
    });
  }

  init () {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.localVideo = document.getElementById(this.localVideoId);

    // It should be compatible with previous version
    if (this.mediaConstraints.video === "camera") {
      this.publishMode = "camera";
    } else if (this.mediaConstraints.video === "screen") {
      this.publishMode = "screen";
    } else if (this.mediaConstraints.video === "screen+camera") {
      this.publishMode = "screen+camera";
    }

    if (!("WebSocket" in window)) {
      console.log("WebSocket not supported.");
      this.callbackError("WebSocketNotSupported");
      return;
    }

    if (!this.isPlayMode && typeof this.mediaConstraints !== "undefined" && this.localStream == null) {
      if (typeof this.mediaConstraints.video !== "undefined" && this.mediaConstraints.video !== false) {
        this.openStream(this.mediaConstraints, this.mode);
      } else {
        // get only audio
        const mediaAudioConstraint = { audio: this.mediaConstraints.audio };
        this.navigatorUserMedia(mediaAudioConstraint, (stream) => {
          this.gotStream(stream);
        }, true)
      }
    }
  }

  joinRoom(roomName, streamId) {
    this.roomName = roomName;

    const jsCmd = {
      command: "joinRoom",
      room: roomName,
      streamId,
    }
    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  play(streamId, token, roomId, enableTracks) {
    this.playStreamId.push(streamId);

    const jsCmd = {
      command: "play",
      streamId,
      token,
      room: roomId,
      trackList: enableTracks,
    }

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  stop(streamId) {
    this.closePeerConnection(streamId);

    const jsCmd = {
      command: "stop",
      streamId,
    };

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  join(streamId) {
    const jsCmd = {
      command: "join",
      streamId,
      multiPeer: this.isMultiPeer && this.multiPeerStreamId == null,
      mode: this.isPlayMode ? "play" : "both",
    };

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  leaveFromRoom(roomName) {
    this.roomName = roomName;
    const jsCmd = {
      command: "leaveFromRoom",
      room: roomName,
    };
    console.log(`leave request is sent for ${roomName}`);

    if ( this.roomTimerId != null) {
      clearInterval(this.roomTimerId);
    }

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  leave(streamId) {
    const jsCmd = {
      command: "leave",
      // if multi peer is enabled
      // this.isMultiPeer && this.multiPeerStreamId !== null ? this.multiPeerStreamId : streamId
      streamId,
    };

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
    this.closePeerConnection(streamId);
    this.multiPeerStreamId = null;
  }

  getStreamInfo(streamId) {
    const jsCmd = {
      command: "getStreamInfo",
      streamId,
    };
    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  getRoomInfo(roomName, streamId) {
    this.roomTimerId = setInterval(() => {
      const jsCmd = {
        command: "getRoomInfo",
        streamId,
        room: roomName,
      };
      this.webSocketAdaptor.send(JSON.stringify(jsCmd));
    }, 5000);
  }

  enableTrack(mainTrackId, trackId, enabled) {
    const jsCmd = {
      command: "enableTrack",
      streamId: mainTrackId,
      trackId,
      enabled,
    };
    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  getTracks(streamId, token) {
    this.playStreamId.push(streamId);
    const jsCmd = {
      command: "getTrackList",
      streamId,
      token,
    }

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  gotStream(stream) {
    this.localStream = stream;
    this.localVideo.srcObject = stream;

    if (this.webSocketAdaptor == null || this.webSocketAdaptor.isConnected() === false) {
      this.restartSocket()
    }
    this.getDevices()
  }

  updateVideoTrack(stream, streamId, mediaConstraints, onEndedCallback, stopDesktop) {
    if (this.remotePeerConnection[streamId] != null) {
      const videoTrackSender = this.remotePeerConnection[streamId].getSenders().find((s) => s.track.kind === "video");

      if (videoTrackSender) {
        videoTrackSender.replaceTrack(stream.getVideoTracks()[0]).then(() => {
          this.updateLocalVideoStream(stream, onEndedCallback, stopDesktop);
        }).catch((error) => {
          console.log(error.name);
        });
      } else {
        console.error("VideoTrackSender is undefined or null");
      }
    } else {
      this.updateLocalVideoStream(stream, onEndedCallback, stopDesktop);
    }
  }

  onTrack(event, streamId) {
    if (this.remoteVideoContainer != null) {
      // this.remoteVideoContainer.srcObject = event.streams[0];
      if (this.remoteVideoContainer.srcObject !== event.streams[0]) {
        // eslint-disable-next-line prefer-destructuring
        this.remoteVideoContainer.srcObject = event.streams[0];
        if (this.debug) {
          console.log('Received remote stream');
        }
      }
    } else {
      const dataObj = {
        stream: event.streams[0],
        track: event.track,
        streamId,
      }
      this.callback("newStreamAvailable", dataObj);
    }
  }

  iceCandidateReceived(event, streamId) {
    if (event.candidate) {
      let protocolSupported = false;

      if (event.candidate.candidate === "") {
        // event candidate can be received and its value can be "".
        // don't compare the protocols
        protocolSupported = true;
      } else if (typeof event.candidate.protocol === "undefined") {
        this.candidateTypes.forEach((element) => {
          if (event.candidate.candidate.toLowerCase().includes(element)) {
            protocolSupported = true;
          }
        });
      } else {
        protocolSupported = this.candidateTypes.includes(event.candidate.protocol.toLowerCase());
      }

      if (protocolSupported) {
        const jsCmd = {
          command: "takeCandidate",
          streamId,
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        };

        if (this.debug) {
          console.log(`sending ice candiate for stream Id ${streamId}` );
          console.log(JSON.stringify(event.candidate));
        }
        this.webSocketAdaptor.send(JSON.stringify(jsCmd));
      } else {
        if (this.debug) {
          console.log(`Candidate's protocol(full sdp: ${event.candidate.candidate}) is not supported. Supported protocols: ${this.candidateTypes}`);
        }
        if (event.candidate.candidate !== "") {
          this.callbackError("protocol_not_supported", `Support protocols: ${this.candidateTypes.toString()} candidate: ${event.candidate.candidate}`);
        }
      }
    } else if (this.debug) {
      console.log("No event.candidate in the iceCandidate event");
    }
  }

  initDataChannel(streamId, dataChannel) {
    // eslint-disable-next-line no-param-reassign
    dataChannel.onerror = (error) => {
      if (this.debug) {
        console.log("Data Channel Error:", error );
      }

      const obj = {
        streamId,
        error,
      };
      console.log("channel status: ", dataChannel.readyState);
      if (dataChannel.readyState !== "closed") {
        this.callbackError("data_channel_error", obj);
      }
    };

    // eslint-disable-next-line no-param-reassign
    dataChannel.onmessage = (event) => {
      const obj = {
        streamId,
        event,
      };
      this.callback("data_received", obj);
    };

    // eslint-disable-next-line no-param-reassign
    dataChannel.onopen = () => {
      this.remotePeerConnection[streamId].dataChannel = dataChannel;
      if (this.debug) {
        console.log("Data channel is opened");
      }
      this.callback("data_channel_opened", streamId)
    };

    // eslint-disable-next-line no-param-reassign
    dataChannel.onclose = () => {
      if (this.debug) {
        console.log("Data channel is closed");
      }

      this.callback("data_channel_closed", streamId);
    };
  }

  // data channel mode can be "publish" , "play" or "peer"
  // based on this it is decided which way data channel is created
  initPeerConnection(streamId, dataChannelMode) {
    if (this.remotePeerConnection[streamId] == null) {
      const closedStreamId = streamId;

      if (this.debug) {
        console.log(`stream id in init peer connection: ${streamId} close stream id: ${closedStreamId}`);
      }

      this.remotePeerConnection[streamId] = new RTCPeerConnection(this.peerconnection_config);
      this.remoteDescriptionSet[streamId] = false;
      this.iceCandidateList[streamId] = [];
      if (!this.playStreamId.includes(streamId)) {
        if (this.localStream != null) {
          this.remotePeerConnection[streamId].addStream(this.localStream);
        }
      }
      this.remotePeerConnection[streamId].onicecandidate = (event) => {
        this.iceCandidateReceived(event, closedStreamId);
      }
      this.remotePeerConnection[streamId].ontrack = (event) => {
        this.onTrack(event, closedStreamId);
      }

      if (dataChannelMode === "publish") {
        // open data channel if it's publish mode peer connection
        const dataChannelOptions = {
          ordered: true,
        };
        if (this.remotePeerConnection[streamId].createDataChannel) {
          const dataChannel = this.remotePeerConnection[streamId]
            .createDataChannel(streamId, dataChannelOptions);
          this.initDataChannel(streamId, dataChannel);
        } else {
          console.warn("CreateDataChannel is not supported");
        }
      } else if (dataChannelMode === "play") {
        // in play mode, server opens the data channel
        this.remotePeerConnection[streamId].ondatachannel = (ev) => {
          this.initDataChannel(streamId, ev.channel);
        };
      } else {
        // for peer mode do both for now
        const dataChannelOptions = {
          ordered: true,
        };

        if (this.remotePeerConnection[streamId].createDataChannel) {
          const dataChannelPeer = this.remotePeerConnection[streamId]
            .createDataChannel(streamId, dataChannelOptions);
          this.initDataChannel(streamId, dataChannelPeer);

          this.remotePeerConnection[streamId].ondatachannel = (ev) => {
            this.initDataChannel(streamId, ev.channel);
          };
        } else {
          console.warn("CreateDataChannel is not supported");
        }
      }

      this.remotePeerConnection[streamId].oniceconnectionstatechange = () => {
        const obj = {state: this.remotePeerConnection[streamId].iceConnectionState, streamId};
        this.callback("ice_connection_state_changed", obj);

        if (!this.isPlayMode) {
          if (this.remotePeerConnection[streamId].iceConnectionState === "connected") {
            this.changeBandwidth(this.bandwidth, streamId).then(() => {
              console.log(`Bandwidth is changed to ${this.bandwidth}`);
            })
              .catch((e) => console.error(e));
          }
        }
      }
    }
  }

  closePeerConnection(streamId) {
    if (this.remotePeerConnection[streamId] !== null) {
      if (this.remotePeerConnection[streamId]?.dataChannel !== null) {
        this.remotePeerConnection[streamId]?.dataChannel?.close();
      }
      if (this.remotePeerConnection[streamId]?.signalingState !== "closed") {
        this.remotePeerConnection[streamId]?.close();
        this.remotePeerConnection[streamId] = null;
        delete this.remotePeerConnection[streamId];
        const playStreamIndex = this.playStreamId.indexOf(streamId);
        if (playStreamIndex !== -1) {
          this.playStreamId.splice(playStreamIndex, 1);
        }
      }
    }

    if (this.remotePeerConnectionStats[streamId] != null) {
      clearInterval(this.remotePeerConnectionStats[streamId].timerId);
      delete this.remotePeerConnectionStats[streamId];
    }
  }

  signallingState(streamId) {
    if (this.remotePeerConnection[streamId] != null) {
      return this.remotePeerConnection[streamId].signalingState;
    }
    return null;
  }

  iceConnectionState(streamId) {
    if (this.remotePeerConnection[streamId] != null) {
      return this.remotePeerConnection[streamId].iceConnectionState;
    }
    return null;
  }

  gotDescription(configuration, streamId) {
    this.remotePeerConnection[streamId]
      .setLocalDescription(configuration)
      .then(() => {
        if (this.debug) {
          console.debug(`Set local description successfully for stream Id ${streamId}`);
        }

        const jsCmd = {
          command: "takeConfiguration",
          streamId,
          type: configuration.type,
          sdp: configuration.sdp,

        };

        if (this.debug) {
          console.debug("local sdp: ");
          console.debug(configuration.sdp);
        }

        this.webSocketAdaptor.send(JSON.stringify(jsCmd));
      }).catch((error) => {
        console.error(`Cannot set local description. Error is: ${error}`);
      });
  }

  turnOffLocalCamera() {
    if (this.remotePeerConnection != null) {
      const track = this.localStream.getVideoTracks()[0];
      track.enabled = false;
    } else {
      this.callbackError("NoActiveConnection");
    }
  }

  turnOnLocalCamera() {
    // If it started in playOnly mode and wants to turn on the camera
    if (this.localStream == null) {
      this.navigatorUserMedia(this.mediaConstraints, (stream) => {
        this.gotStream(stream);
      }, false);
    } else if (this.remotePeerConnection != null) {
      const track = this.localStream.getVideoTracks()[0];
      track.enabled = true;
    }
  }

  muteLocalMic() {
    if (this.remotePeerConnection != null) {
      const track = this.localStream.getAudioTracks()[0];
      track.enabled = false;
    } else {
      this.callbackError("NoActiveConnection");
    }
  }

  takeConfiguration(idOfStream, configuration, typeOfConfiguration) {
    const streamId = idOfStream
    const type = typeOfConfiguration;
    const conf = configuration;
    const isTypeOffer = (type === "offer");

    let dataChannelMode = "publish";
    if (isTypeOffer) {
      dataChannelMode = "play";
    }

    this.initPeerConnection(streamId, dataChannelMode);

    this.remotePeerConnection[streamId].setRemoteDescription(new RTCSessionDescription({
      sdp: conf,
      type,
    })).then((response) => {
      if (this.debug) {
        console.debug(`set remote description is succesfull with response: ${response} for stream : ${streamId} and type: ${type}`);
        console.debug(conf);
      }

      this.remoteDescriptionSet[streamId] = true;
      const {length} = this.iceCandidateList[streamId];

      if (this.debug) {
        console.debug(`Ice candidate list size to be added: ${length}`);
      }
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < length; i++) {
        this.addIceCandidate(streamId, this.iceCandidateList[streamId][i]);
      }
      this.iceCandidateList[streamId] = [];

      if (isTypeOffer) {
        // SDP constraints may be different in play mode
        if (this.debug) {
          console.log(`try to create answer for stream id: ${streamId}`);
        }

        this.remotePeerConnection[streamId].createAnswer(this.sdp_constraints)
          .then((configuration) => {
            if (this.debug) {
              console.log(`created answer for stream id: ${streamId}`);
            }
            this.gotDescription(configuration, streamId);
          })
          .catch((error) => {
            console.error(`create answer error :${error}`);
          });
      }
    }).catch((error) => {
      if (this.debug) {
        console.error(`set remote description is failed with error: ${error}`);
      }
      if (error.toString().indexOf("InvalidAccessError") > -1 || error.toString().indexOf("setRemoteDescription") > -1) {
        // This error generally occurs in codec incompatibility.
        // AMS for a now supports H.264 codec.
        // This error happens when some browsers try to open it from VP8.
        this.callbackError("notSetRemoteDescription");
      }
    });
  }

  takeCandidate(idOfTheStream, tmpLabel, tmpCandidate) {
    const streamId = idOfTheStream;
    const label = tmpLabel;
    const candidateSdp = tmpCandidate;

    const candidate = new RTCIceCandidate({
      sdpMLineIndex: label,
      candidate: candidateSdp,
    });

    const dataChannelMode = "peer";
    this.initPeerConnection(streamId, dataChannelMode);

    if (this.remoteDescriptionSet[streamId] === true) {
      this.addIceCandidate(streamId, candidate);
    } else {
      if (this.debug) {
        console.debug("Ice candidate is added to list because remote description is not set yet");
      }
      this.iceCandidateList[streamId].push(candidate);
    }
  }

  addIceCandidate(streamId, candidate) {
    let protocolSupported = false;
    if (candidate.candidate === "") {
      // candidate can be received and its value can be "".
      // don't compare the protocols
      protocolSupported = true;
    } else if (typeof candidate.protocol === "undefined") {
      this.candidateTypes.forEach((element) => {
        if (candidate.candidate.toLowerCase().includes(element)) {
          protocolSupported = true;
        }
      });
    } else {
      protocolSupported = this.candidateTypes.includes(candidate.protocol.toLowerCase());
    }

    if (protocolSupported) {
      this.remotePeerConnection[streamId].addIceCandidate(candidate)
        .then(() => {
          if (this.debug) {
            console.log(`Candidate is added for stream ${streamId}`);
          }
        })
        .catch((error) => {
          console.error(`ice candiate cannot be added for stream id: ${streamId} error is: ${error}` );
          console.error(candidate);
        });
    } else if (this.debug) {
      console.log(`Candidate's protocol(${candidate.protocol}) is not supported. Candidate: ${candidate.candidate} Supported protocols:${this.candidateTypes}`);
    }
  }

  startPublishing(idOfStream) {
    const streamId = idOfStream;

    this.initPeerConnection(streamId, "publish");

    this.remotePeerConnection[streamId].createOffer(this.sdp_constraints)
      .then((configuration) => {
        this.gotDescription(configuration, streamId);
      })
      .catch((error) => {
        console.error(`create offer error for stream id: ${streamId} error: ${error}`);
      });
  }

  getStats(streamId) {
    if (this.debug) {
      console.log(`peerstatsgetstats = ${this.remotePeerConnectionStats[streamId]}`);
    }

    this.remotePeerConnection[streamId].getStats(null).then((stats) => {
      let bytesReceived = -1;
      let videoPacketsLost = -1;
      let audioPacketsLost = -1;
      let fractionLost = -1;
      let currentTime = -1;
      let bytesSent = -1;
      let audioLevel = -1;
      let qlr = "";
      let framesEncoded = -1;
      let width = -1;
      let height = -1;
      let fps = -1;
      let frameWidth = -1;
      let frameHeight = -1;
      let videoRoundTripTime = -1;
      let videoJitter = -1;

      let audioRoundTripTime = -1;
      let audioJitter = -1;

      let framesDecoded = -1;
      let framesDropped = -1;
      let framesReceived = -1;

      let audioJitterAverageDelay = -1;
      let videoJitterAverageDelay = -1;

      stats.forEach((value) => {
        if (value.type === "inbound-rtp" && typeof value.kind !== "undefined") {
          bytesReceived += value.bytesReceived;
          if (value.kind === "audio") {
            audioPacketsLost = value.packetsLost;
          } else if (value.kind === "video") {
            videoPacketsLost = value.packetsLost;
          }

          fractionLost += value.fractionLost;
          currentTime = value.timestamp;
        } else if (value.type === "outbound-rtp") {
          bytesSent += value.bytesSent
          currentTime = value.timestamp
          qlr = value.qualityLimitationReason;
          if (value.framesEncoded != null) {
            // audio tracks are undefined here
            framesEncoded += value.framesEncoded;
          }
        } else if (value.type === "track" && typeof value.kind !== "undefined" && value.kind === "audio") {
          if (typeof value.audioLevel !== "undefined") {
            audioLevel = value.audioLevel;
          }

          if (typeof value.jitterBufferDelay !== "undefined" && typeof value.jitterBufferEmittedCount !== "undefined") {
            audioJitterAverageDelay = value.jitterBufferDelay / value.jitterBufferEmittedCount;
          }
        } else if (value.type === "track" && typeof value.kind !== "undefined" && value.kind === "video") {
          if (typeof value.frameWidth !== "undefined") {
            frameWidth = value.frameWidth;
          }
          if (typeof value.frameHeight !== "undefined") {
            frameHeight = value.frameHeight;
          }

          if (typeof value.framesDecoded !== "undefined") {
            framesDecoded = value.framesDecoded;
          }

          if (typeof value.framesDropped !== "undefined") {
            framesDropped = value.framesDropped;
          }

          if (typeof value.framesReceived !== "undefined") {
            framesReceived = value.framesReceived;
          }

          if (typeof value.jitterBufferDelay !== "undefined" && typeof value.jitterBufferEmittedCount !== "undefined") {
            videoJitterAverageDelay = value.jitterBufferDelay / value.jitterBufferEmittedCount;
          }
        } else if (value.type === "remote-inbound-rtp" && typeof value.kind !== "undefined") {
          if (typeof value.packetsLost !== "undefined") {
            if (value.kind === "video") {
              // this is the packetsLost for publishing
              videoPacketsLost = value.packetsLost;
            } else if (value.kind === "audio") {
              // this is the packetsLost for publishing
              audioPacketsLost = value.packetsLost;
            }
          }

          if (typeof value.roundTripTime !== "undefined") {
            if (value.kind === "video") {
              videoRoundTripTime = value.roundTripTime;
            } else if (value.kind === "audio") {
              audioRoundTripTime = value.roundTripTime;
            }
          }

          if (typeof value.jitter !== "undefined") {
            if (value.kind === "video") {
              videoJitter = value.jitter;
            } else if (value.kind === "audio") {
              audioJitter = value.jitter;
            }
          }
        } else if (value.type === "media-source") {
          if (value.kind === "video") {
            // returns video source dimensions, not necessarily dimensions being encoded by browser
            width = value.width;
            height = value.height;
            fps = value.framesPerSecond;
          }
        }
      });

      this.remotePeerConnectionStats[streamId].totalBytesReceived = bytesReceived;
      this.remotePeerConnectionStats[streamId].videoPacketsLost = videoPacketsLost;
      this.remotePeerConnectionStats[streamId].audioPacketsLost = audioPacketsLost;
      this.remotePeerConnectionStats[streamId].fractionLost = fractionLost;
      this.remotePeerConnectionStats[streamId].currentTime = currentTime;
      this.remotePeerConnectionStats[streamId].totalBytesSent = bytesSent;
      this.remotePeerConnectionStats[streamId].audioLevel = audioLevel;
      this.remotePeerConnectionStats[streamId].qualityLimitationReason = qlr;
      this.remotePeerConnectionStats[streamId].totalFramesEncoded = framesEncoded;
      this.remotePeerConnectionStats[streamId].resWidth = width;
      this.remotePeerConnectionStats[streamId].resHeight = height;
      this.remotePeerConnectionStats[streamId].srcFps = fps;
      this.remotePeerConnectionStats[streamId].frameWidth = frameWidth;
      this.remotePeerConnectionStats[streamId].frameHeight = frameHeight;
      this.remotePeerConnectionStats[streamId].videoRoundTripTime = videoRoundTripTime;
      this.remotePeerConnectionStats[streamId].videoJitter = videoJitter;
      this.remotePeerConnectionStats[streamId].audioRoundTripTime = audioRoundTripTime;
      this.remotePeerConnectionStats[streamId].audioJitter = audioJitter;
      this.remotePeerConnectionStats[streamId].framesDecoded = framesDecoded;
      this.remotePeerConnectionStats[streamId].framesDropped = framesDropped;
      this.remotePeerConnectionStats[streamId].framesReceived = framesReceived;

      this.remotePeerConnectionStats[streamId].videoJitterAverageDelay = videoJitterAverageDelay;
      this.remotePeerConnectionStats[streamId].audioJitterAverageDelay = audioJitterAverageDelay;

      this.callback("updated_stats", this.remotePeerConnectionStats[streamId]);
    });
  }

  disableStats(streamId) {
    clearInterval(this.remotePeerConnectionStats[streamId].timerId);
  }

  enableStats(streamId) {
    if (this.remotePeerConnectionStats[streamId] == null) {
      this.remotePeerConnectionStats[streamId] = new PeerStats(streamId);
      this.remotePeerConnectionStats[streamId].timerId = setInterval(() => {
        this.getStats(streamId);
      }, 5000);
    }
  }

  // After calling this function, create new WebRTCAdaptor instance, don't use the the same object
  // Because all streams are closed on server side as well when websocket connection is closed.

  closePeerConnections() {
    Object.values(this.remotePeerConnection).forEach((peerConnection) => {
      peerConnection.close();
    });

    // for (const key in this.remotePeerConnection) {
    //   this.remotePeerConnection[key].close();
    // }
    // free the remote peer connection by initializing again
    this.remotePeerConnection = [];
  }

  peerMessage(streamId, definition, data) {
    const jsCmd = {
      command: "peerMessageCommand",
      streamId,
      definition,
      data,
    };

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  forceStreamQuality(streamId, resolution) {
    const jsCmd = {
      command: "forceStreamQuality",
      streamId,
      streamHeight: resolution,
    };
    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  sendData(streamId, message) {
    const {dataChannel} = this.remotePeerConnection[streamId];
    dataChannel.send(message);
  }
}
