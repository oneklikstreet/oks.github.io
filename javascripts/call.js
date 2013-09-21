define(["jquery","underscore", "backbone", "callstate", "callview", "media", "signaling"], function ($,underscore, backbone, callstate, callview, media, signaling) {

    return {
        initialize : function(){
            this.listenTo(channel, "connected");
            this.listenTo(callstate, "IDLE");

        },
        callStart : function(channel) {
            
            var state = new CallState();
            var view = new CallView ({model: state});
            view.listenTo(channel, "message_in", signaling.processSignalingMessage);
            view.channel = channel;
            console.log("step 3");
            //media.do_get_user_media("video", view);
            state.dial("video");
        }
    };

});
