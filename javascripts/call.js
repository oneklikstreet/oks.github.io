define(["jquery","underscore", "backbone", "callstate", "callview", "media"], function ($,underscore, backbone, callstate, callview, media) {

    return {
        callStart : function(channel) {
            //console.log(_.random(0, 100));
            //  console.log($);
            
            var state = new CallState();
            //console.log("state at creation is " + state.currentState() + state);
            var view = new CallView ({model: state});
            view.channel = channel;
            console.log(view.channel);
            console.log("step 3");
            media.do_get_user_media("video", view);
        }
    };

});
