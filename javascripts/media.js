define ( ["constraints", "webrtc"], function(constraints, webrtc) {

    onUserMediaError = function(error) {
        console.log("Failed to get access to local media. Error code was " + error.code);
        //call_events("Failed to get access to local media. Error code was " + error.code);
        alert(" Error: Failed to get access to Camera/Mic. Error code was " + error.code + ".");
    };

    return {
        do_get_user_media: function (enableVideo, onUserMediaSuccess) {
          //var stream_test = null;
          //onUserMediaSuccess.createPeerConnection(stream_test);
          //return;
            // Call into getUserMedia via the polyfill (adapter.js).
            try {
              webrtc.getUserMedia({'audio':true, 'video':enableVideo}, onUserMediaSuccess.createPeerConnection,
                           onUserMediaError);
              //console.log("Requested access to local media with mediaConstraints:\n" +
              //            "  \"" + JSON.stringify(constraints[call_type]) + "\"");
            } catch (e) {
              console.log("getUserMedia() failed. Is this a WebRTC capable browser?");
              console.log("getUserMedia failed with exception: " + e.message);

              msg = " Error: The camera/microphone might not work on this browser as it lacks full HTML5 support. Please download and use the most secure and fastest browser: Google Chrome." ;
              //call_events( msg + e.message);
              alert(msg);

            }
        }
    }

});
