define(["jquery","underscore", "backbone", "webrtc", "constraints", "callconstants", "media"],
       function ($,underscore, backbone, webrtc, constraints, callconstants, media){

    Backbone.$ = $;
    makeid = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    var CallView = Backbone.View.extend ({

        initialize: function() {
            that = this;
            pc = {};
            this.listenTo(this.model, 'IDLE',  this.get_media);
            this.listenTo(this.model, 'ANSWERED', this.setRemote);
            this.localvideo = document.getElementById("localvideo") || null;
            this.remotevideo = document.getElementById("remotevideo") || null;
            this.from_tag = makeid();
            this.call_id = makeid();
            this.conf_id = "ty1";
            console.log('CallView initialized');
        },
        get_media : function () {
            call_type = this.model.get('type');
            if (call_type === callconstants.VIDEO)
                this.video();
            if (call_type === callconstants.VOICE)
                this.voice();
            if (call_type === callconstants.AUDIENCE)
                this.audience();
        }, 
        video : function (){
            console.log("triggered video");
            media.do_get_user_media(true, this);
        },
        voice : function (){
            console.log("triggered voice");
            media.do_get_user_media(false, this);
        },
        audience : function (){
            console.log("triggered audience");
            media.do_get_user_media(false, this);
        },
        stream_check: function(stream){
            var video_tracks = stream.getVideoTracks();
            var audio_tracks = stream.getAudioTracks();
            if(audio_tracks === ""){
                msg = "Failed to get access to microphone";
                //call_events(msg);
                alert(msg);
            }
            if(video_tracks === "" && mode === VIDEO) {
                msg = "Failed to get access to camera";
                //call_events(msg);
                alert(msg);
            }
        },
        setRemote: function(message) {
            pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', 
                                                                sdp: message.body }));
        },    
        onRemoteStreamAdded: function(event) {
            console.log("Remote stream added.");
            console.log("call connected.");
            webrtc.attachMediaStream(that.remotevideo, event.stream);
            remoteStream = event.stream;
        },
        onRemoteStreamRemoved: function(event) {
            console.log("Remote stream removed.");
        },
        onIceCandidate: function(event) {
            if (event.candidate) {
                console.log(event.candidate);
                if(that.model.currentState() === "IDLE"){
                    //console.log(pc.localDescription.sdp);
                    var invite_msg = JSON.stringify({  "method": "INVITE", 
                                                        "fromtag": that.from_tag, 
                                                        "callid": that.call_id, 
                                                        "confid": that.conf_id, 
                                                        "user-agent": "browser", 
                                                        "sdp": pc.localDescription.sdp
                                                    });
                    that.trigger("VIEW_CHANGE", invite_msg);
                    that.model.changeState("OFFER_MADE");
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
            console.log("User has granted access to local media.");
            if (that.localvideo !== null)
                webrtc.attachMediaStream(that.localvideo, stream);
            localStream = stream;
            console.log("Creating PeerConnection.");

            try {
                pc = new webkitRTCPeerConnection(null);
                console.log("Created RTCPeerConnnection \n");
            } catch (e) {
                console.log("Failed to create PeerConnection, exception: " + e.message);
                return;
            }
            pc.onicecandidate = that.onIceCandidate;
            pc.onaddstream = that.onRemoteStreamAdded;
            pc.onremovestream = that.onRemoteStreamRemoved;
            console.log("Adding local stream.");
            pc.addStream(localStream);
            pc.createOffer(that.sdpProcessing, null, constraints.video);
        }

    });
    return CallView;
});
