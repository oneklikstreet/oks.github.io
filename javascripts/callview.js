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
            this.listenTo(this.model, 'REGISTER', this.doRegister);
            this.listenTo(this.model, 'IDLE',  this.getMedia);
            this.listenTo(this.model, 'ANSWERED', this.setRemote);
            this.listenTo(this.model, 'HANGUP', this.doCleanup);
            this.localvideo = document.getElementById("localvideo") || null;
            this.remotevideo = document.getElementById("remotevideo") || null;
            this.from_tag = makeid();
            this.call_id = makeid();
            this.conf_id = "oks1";
            console.log('CallView initialized');
        },
        getMedia : function () {
            call_type = this.model.get('type');
            if (call_type === callconstants.VIDEO)
                this.doVideo();
            if (call_type === callconstants.VOICE)
                this.doVoice();
            if (call_type === callconstants.AUDIENCE)
                this.doAudience();
        }, 
        doVideo : function (){
            console.log("triggered video");
            media.getLocalDeviceAccess(true, this);
        },
        doVoice : function (){
            console.log("triggered voice");
            media.getLocalDeviceAccess(false, this);
        },
        doAudience : function (){
            console.log("triggered audience");
            media.getLocalDeviceAccess(false, this);
        },
        doStreamCheck: function(stream){
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
        doCleanup: function(){
         
         //{"method":"REGISTER","fromtag":"FsyVc","callid":"sp7Ks","confid":"oks1","user-agent":"browser"}
         var bye_msg = JSON.stringify({  "method": "HANGUP",
                                           "fromtag": that.from_tag,
                                           "callid": that.call_id,
                                           "confid": that.conf_id,
                                           "user-agent": "browser"
                                           });
         that.trigger("VIEW_CHANGE", bye_msg);
         
        },
        doRegister: function(){
         
            //{"method":"REGISTER","fromtag":"FsyVc","callid":"sp7Ks","confid":"oks1","user-agent":"browser"}
             var register_msg = JSON.stringify({  "method": "REGISTER",
                                         "fromtag": that.from_tag,
                                         "callid": that.call_id,
                                         "confid": that.conf_id,
                                         "user-agent": "browser"
                                         });
             that.trigger("VIEW_CHANGE", register_msg);
         
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
            that.doStreamCheck(stream);
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
