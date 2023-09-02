const kurentoUtils = require('kurento-utils');
/**
 * This js library helps the intended users to manage a WebRtc based audio channel. This library uses Kurento Media Server
 * as it's WebRtc implementation, and it relies on a proprietary signaling server to manage the signaling plane.
 *
 * This library provides default implementation for the entire signaling process needed to setup a media pipeline in
 * Kurento Media Server. It depends on a few libraries - WebRtc (adapter.js), Kurento (kurento-utils.min.js),
 * jQuery (jquery.min.js), among others. You should find the dependency libraries in the package itself.
 *
 * Usage:
 * 1) create an instance of this library like - new KurentoSignalingLibrary(websocket, subscriberId).
 * On this created instance -
 * 2) please register your websocket.onMessage() (only for messages with communicationType = KURENTO) hook with
 * processKurentomessage() of this library.
 * 3) call createWebRtcPeer() to initiate the process of Kurento media pipeline negotiation with the signaling server.
 * This invocation gets the library working actively to negotiate a media pipeline.
 * 4) call shutdownWebRtcPeer() to release client side resources pertaining to WebRtc communication.
 *
 * Created by sumesh on 6/7/18.
 */

/**
 * This is the constructor of the library
 *
 * @param websocket a websocket instance to send and receive messages with
 * @param subscriberId the subscriberId which will be used to in the websocket messages sent to the signaling server
 * @constructor
 */
export function KurentoSignalingLibrary (websocket, subscriberId) {
    this.websocket = websocket; //setting the websocket instance in the class scope
    this.subscriberId = subscriberId; //setting the subscriberId for this instance
}

/**
 * This is the processing block for any message received from the signaling server whose communicationType is KURENTO.
 * One may choose to process the messages themselves if the need arises, but this client comes with default implementations
 * of what should happen when a particular type of KURENTO message has been received by the client.
 *
 * @param message The message from SS with communicationType = KURENTO
 * @param pipelineActiveCallback The callback to be executed when the SS sends a kurento message of type WEBRTC_PIPELINE_ACTIVE
 */
KurentoSignalingLibrary.prototype.processKurentoMessage = function (message, pipelineActiveCallback) {
    try{
        // const parsedMessage = JSON.parse(message.data);
        const parsedMessage = message;
        // console.log('[processKurentoMessage] Received kurento message: ' + message.data);

        if (!(parsedMessage.communicationType === 'KURENTO')) {
            // console.error('[processKurentoMessage] incorrect message received. expected communicationType is KURENTO, but we' +
                // 'got: ' + message.communicationType);
            return;
        }

        switch (parsedMessage.messageType) {
            case 'WEBRTC_SDP_ANSWER': //sdp answer received from kurento via SS
                this.processSdpResponse(parsedMessage);
                break;
            case 'WEBRTC_ICE_CANDIDATE': //ice candidate sent by kurento via SS
                this.webRtcPeer.addIceCandidate(JSON.parse(parsedMessage.message), function (error) {
                    if (error) {
                        // console.error('[processKurentoMessage] Error adding candidate: ' + error);
                        return;
                    }
                });
                break;
            case 'WEBRTC_PIPELINE_ACTIVE': //kurento negotiation is complete and the media pipeline has been setup successfully
                pipelineActiveCallback();
                break;
            default:
                // console.error('[processKurentoMessage] incorrect KURENTO message received. Not processing further: ', parsedMessage);
                break;
        }
    } catch (e) {

    }
};

/**
 * Translates the WebRtcPeer error into simple error messages
 *
 * @param error The WebRtcPeer error
 * @returns {string} The simple error message
 */
KurentoSignalingLibrary.prototype.explainUserMediaError = function (error) {
    const n = error.name;
    if (n === 'NotFoundError' || n === 'DevicesNotFoundError') {
        return "Missing microphone for required tracks";
    }
    else if (n === 'NotReadableError' || n === 'TrackStartError') {
        return "Microphone is already in use";
    }
    else if (n === 'OverconstrainedError' || n === 'ConstraintNotSatisfiedError') {
        return "Microphone doesn't provide required tracks";
    }
    else if (n === 'NotAllowedError' || n === 'PermissionDeniedError') {
        return "Microphone permission has been denied by the user";
    }
    else if (n === 'TypeError') {
        return "No media tracks have been requested";
    }
    else {
        return "Unknown error";
    }
};

/**
 * Sends a message to the signaling server
 *
 * @param message the message that needs to be sent
 */
KurentoSignalingLibrary.prototype.sendMessage = function (message) {
    const jsonMessage = JSON.stringify(message);
    // console.log('[sendMessage] message: ' + jsonMessage);
    this.websocket.send(jsonMessage);
};

/**
 * Call this method to initiate the brokering of Kurento media pipeline. This method creates a WebRtcPeer which can send
 * and receive audio streams.
 *
 * Note:- It is important to register your websocket messages with {@method processKurentoMessage()} first (if you choose
 * to use the default implementation), because upon createWebRtcPeer() the messages start flowing almost instantly, and if you do not
 * have an appropriate message processor in place, the negotiation may not complete successfully.
 *
 * @param videoElement The video element on which the audio received is rendered
 */
KurentoSignalingLibrary.prototype.createWebRtcPeer = function (videoElement) {
    // console.log('[createWebRtcPeer] Create WebRtcPeer');
    const options = {
        remoteVideo: videoElement,
        mediaConstraints: {audio: true, video: false},
        onicecandidate: this.onIceCandidate.bind(this)
    };
    var _self = this;
    this.webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
        function (error) {
            if (error) {
                // console.error('[WebRtcPeer] Error in constructor: ' + _self.explainUserMediaError(error));
                return;
            }
            // console.log('[WebRtcPeer] Generate SDP Offer');
            _self.webRtcPeer.generateOffer(_self.onWebRtcSdpOffer.bind(_self));
        });
};

/**
 * Helper method to forward the SDP offer to Signaling Server
 *
 * @param error callback in case of error
 * @param offerSdp the SDP offer generated by WebRtcPeer
 */
KurentoSignalingLibrary.prototype.onWebRtcSdpOffer = function (error, offerSdp) {
    if (error) {
        // console.error('[onWebRtcSdpOffer] Error generating SDP Offer: ' + error);
        return;
    }

    // console.log('[onWebRtcSdpOffer] Received SDP Offer from WebRtcPeer; relay message to SS at ' + location.host);

    const message = {
        messageType: 'WEBRTC_SDP_OFFER',
        message: offerSdp,
        communicationType: 'KURENTO',
        subscriberId: this.subscriberId
    };
    this.sendMessage(message);
};


/**
 * Helper method to forwards local ice candidate to Kurento via the SS
 *
 * @param candidate the ice candidate object
 */
KurentoSignalingLibrary.prototype.onIceCandidate = function (candidate) {
    // console.log('[onIceCandidate] Local candidate: ' + JSON.stringify(candidate));

    const message = {
        messageType: 'WEBRTC_ON_ICE_CANDIDATE',
        communicationType: 'KURENTO', //added for SS
        subscriberId: this.subscriberId,
        message: JSON.stringify(candidate)
    };
    this.sendMessage(message);
};

/**
 * Helper method to process the SDP answer received from the signaling server
 *
 * @param message the sdp answer
 */
KurentoSignalingLibrary.prototype.processSdpResponse = function (message) {
    // console.log('[processSdpResponse] SDP Answer received from SS; process in WebRtcPeer');

    this.webRtcPeer.processAnswer(message.message, function (error) {
        if (error) {
            // console.error('[processSdpResponse] Error processing SDP Answer: ' + error);
            return;
        }
    });
}

/**
 * Call this shutdown hook to avoid leaky resources. This method disposes the webRtcPeer resources that were initialized
 * earlier.
 */
KurentoSignalingLibrary.prototype.shutdownWebRtcPeer = function () {
    // console.log('[shutdownWebRtcPeer] shut down hook called. Disposing WebRtcPeer resources');

    if (this.webRtcPeer) {
        this.webRtcPeer.dispose();
        this.webRtcPeer = null;

        const message = {
            messageType: 'KILL',
            communicationType: 'KURENTO', //added for SS
            subscriberId: this.subscriberId
        };
        this.sendMessage(message);
    }
};