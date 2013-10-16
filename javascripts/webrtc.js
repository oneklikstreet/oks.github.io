define([], function() {

    if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function() {
            return this.videoTracks;
        };
        webkitMediaStream.prototype.getAudioTracks = function() {
            return this.audioTracks;
        };
    }

    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function() {
            return this.localStreams;
        };
        webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
            return this.remoteStreams;
        };
    }
       
    return {
       
        webrtcDetectedBrowser : "chrome",
        getUserMedia : navigator.webkitGetUserMedia.bind(navigator),
        attachMediaStream : function(element, stream) {
            element.src = webkitURL.createObjectURL(stream);
            console.log("attach media stream " + element.src);
            element.style.display = 'block';
        },
        deletMediaStream : function(element) {
            console.log("delete media stream " + element.src);
            webkitURL.revokeObjectURL(element.src);
            element.pause();
            element.style.display = 'none';
            element.src = null;
        },
        reattachMediaStream : function(to, from) {
            to.src = from.src;
        }
       
    }
});