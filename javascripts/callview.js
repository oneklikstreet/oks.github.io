define(["jquery","underscore", "backbone", "webrtc", "constraints", "callconstants"], function ($,underscore, backbone, webrtc, constraints, callconstants) {

    Backbone.$ = $;
    makeid = function ()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    CallView = Backbone.View.extend({

        initialize: function() {
            that = this;
            console.log('reached here');
            this.listenTo(this.model, 'VIDEO',  this.video);
            this.listenTo(this.model, 'AUDIO',  this.audio);
            this.listenTo(this.model, 'AUDIENCE',  this.audience);
            this.listenTo(this.model, 'CALLSTART',  this.createPeerConnection);
            this.localvideo = document.getElementById("localvideo");
            this.remotevideo = document.getElementById("remotevideo");
            this.from_tag = makeid();
            this.call_id = makeid();
            this.conf_id = "ty1";
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
                //call_events(msg);
                alert(msg);
            }
            if(video_tracks === "" && mode === VIDEO) {
                msg = "failed to get camera";
                //call_events(msg);
                alert(msg);
            }
        },
        onRemoteStreamAdded: function(event) {
            console.log("Remote stream added.");
            console.log("call connected.");
            //call_events("call connected.");
            //helptag.style.display = "none";
            webrtc.attachMediaStream(that.remotevideo, event.stream);
            //remoteVideo2.src = remoteVideo1.src;
            //remoteVideo3.src = remoteVideo1.src;
            //remoteVideo4.src = remoteVideo1.src;
            //active1.src = remoteVideo1.src;
            //console.log(remoteVideo1.src);
            remoteStream = event.stream;
        },
        onRemoteStreamRemoved: function(event) {
            console.log("Remote stream removed.");
        },
        onIceCandidate: function(event) {
            if (event.candidate) {
                if(that.model.currentState() === callconstants.FAIL){
                    that.model.changeState(callconstants.IDLE);
                    //console.log("What is the state here?" + that.model.currentState() + that.model + that);
                    console.log(pc.localDescription.sdp);
                    var invite_msg = JSON.stringify({"method":"INVITE", "fromtag":that.from_tag, "callid":that.call_id, "confid":that.conf_id, "user-agent": "browser", "sdp":pc.localDescription.sdp});
                    that.channel.sendMessage(invite_msg);
                }
            } else {
              console.log("End of candidates.");
            }
        },
        sdpProcessing: function(sessionDescription){
            //sessionDescription.sdp = removeCN(sessionDescription.sdp);
            //console.log('got sdp\n'+sessionDescription.sdp);
            // setLocalDesciption is the one who starts the ice
            pc.setLocalDescription(sessionDescription);
        },
        createPeerConnection: function(stream) {
            that.stream_check(stream);
            console.log("got both video and camera.");
            console.log("User has granted access to local media.");
            console.log(webrtc);
            webrtc.attachMediaStream(that.localvideo, stream);
            localStream = stream;
            console.log("Connecting...");
            console.log("Creating PeerConnection.");

            try {
              pc = new webkitRTCPeerConnection(null);
              console.log("Created RTCPeerConnnection \n");
            } catch (e) {
              console.log("Failed to create PeerConnection, exception: " + e.message);
              //call_events("Failed to create PeerConnection, exception: " + e.message);
              //alert("Cannot create RTCPeerConnection object; WebRTC is not supported by this browser.");
              return;
            }
            pc.onicecandidate = that.onIceCandidate;
            pc.onaddstream = that.onRemoteStreamAdded;
            pc.onremovestream = that.onRemoteStreamRemoved;
            console.log("Adding local stream.");
            pc.addStream(localStream);
            started = true;
            pc.createOffer(that.sdpProcessing, null, constraints.video);
        }

    });

});
