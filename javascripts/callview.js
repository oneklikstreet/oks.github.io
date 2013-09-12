define(["backbone", "underscore"], function (Backbone, _) {

    CallView = Backbone.View.extend({
        
        initialize: function() {
            this.listenTo(this.model, 'VIDEO',  this.video);
            this.listenTo(this.model, 'AUDIO',  this.audio);
            this.listenTo(this.model, 'AUDIENCE',  this.audience);
            this.listenTo(this.model, 'CALLSTART',  this.createPeerConnection);
        },
        video : function (call_state){
            if(call_state == IDLE) {
                mode = VIDEO;
                do_get_user_media(true, this.call_view);
            }
        },
        voice : function (call_state){
            if(call_state == IDLE) {
                mode = VOICE;
                do_get_user_media(false, this.call_view);
            }
        },
        audience : function (call_state){
            if(call_state == IDLE) {
                mode = AUDIENCE;
                do_get_user_media(false, this.call_view);
            }
        },
        stream_check: function(stream){
            var video_tracks = stream.getVideoTracks();
            var audio_tracks = stream.getAudioTracks();
            if(audio_tracks === ""){
                msg = "failed to get mic";
                call_events(msg);
                alert(msg);
            }
            if(video_tracks === "" && mode === VIDEO) {
                msg = "failed to get camera";
                call_events(msg);
                alert(msg);
            }
        },
        onRemoteStreamAdded: function(event) {
            console.log("Remote stream added.");
            console.log("call connected.");
            call_events("call connected.");
            helptag.style.display = "none";
            attachMediaStream(remoteVideo1, event.stream);
            remoteVideo2.src = remoteVideo1.src;
            remoteVideo3.src = remoteVideo1.src;
            remoteVideo4.src = remoteVideo1.src;
            active1.src = remoteVideo1.src;
            console.log(remoteVideo1.src);
            remoteStream = event.stream;
        },
        onRemoteStreamRemoved: function(event) {
            console.log("Remote stream removed.");
        },
        onIceCandidate: function(event) {
            if (event.candidate) {
                if(call_state == IDLE){
                    call_state = OFFER_MADE;
                    console.log(pc.localDescription.sdp);
                    var invite_msg = JSON.stringify({"method":"INVITE", "fromtag":from_tag, "callid":call_id, "confid":conf_id, "user-agent": "browser", "sdp":pc.localDescription.sdp});
                    socketSend(invite_msg);
                }
            } else {
              console.log("End of candidates.");
            }
        },
        sdpProcessing: function(sessionDescription){
            sessionDescription.sdp = removeCN(sessionDescription.sdp);
            console.log('got sdp\n'+sessionDescription.sdp);
            // setLocalDesciption is the one who starts the ice
            pc.setLocalDescription(sessionDescription);
        },
        createPeerConnection: function(stream) {
            this.stream_check(stream);
            console.log("got both video and camera.");
            console.log("User has granted access to local media.");
            attachMediaStream(testVideo, stream);
            attachMediaStream(activeself, stream);
            localStream = stream;
            setStatus("Connecting...");
            console.log("Creating PeerConnection.");
            try {
              pc = new RTCPeerConnection(null);
              console.log("Created RTCPeerConnnection \n");
            } catch (e) {
              console.log("Failed to create PeerConnection, exception: " + e.message);
              call_events("Failed to create PeerConnection, exception: " + e.message);
              //alert("Cannot create RTCPeerConnection object; WebRTC is not supported by this browser.");
              return;
            }
            pc.onicecandidate = onIceCandidate;
            pc.onaddstream = onRemoteStreamAdded;
            pc.onremovestream = onRemoteStreamRemoved;
            console.log("Adding local stream.");
            pc.addStream(localStream);
            started = true;
            pc.createOffer(sdpProcessing, null, sdp_constraints);
        }

    });
});
