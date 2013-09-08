define(["constraints", "webrtc"], function (constraints, webrtc) {

    return {
        video : function (call_state, call_view_setup){
            if(call_state == IDLE) {
                mode = VIDEO;
                do_get_user_media(true, call_view_setup);
            }
        }
            
        voice : function (call_state, call_view_setup){
            if(call_state == IDLE) {
                mode = VOICE;
                do_get_user_media(false, call_view_setup);
            }
        }

        audience : function (call_state, call_view_setup){
            if(call_state == IDLE) {
                mode = AUDIENCE;
                do_get_user_media(false, call_view_setup);
            }
        }

    }

});
