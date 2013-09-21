define(["jquery","underscore", "backbone", "callstate", "callview", "media", "signaling", "channel"
    ], 
    function ($,underscore, backbone, callstate, callview, channel) {


// user triggers call with "video"
// calljs triggers callstate with "idle"
// calljs triggers channel with "connect"
// channel triggers calljs with "connected"
// calljs triggers callsate with "offer"
// callstate trigggers media with "video"

    var Call = function(){
        this.initialize.apply(this, arguments);
    };
    _.extend(Call.prototype, Backbone.Events, {
        call_channel : {},
        call_state : {},
        call_view : {},
        initialize : function(channel){
            console.log("called call init"); 
            call_channel = channel;
            call_state = new callstate();
            call_view = new callview({model: call_state});
            this.listenTo(call_channel, "message_in", this.message_handler);
            this.listenTo(call_state, "IDLE");
            call_channel.trigger("connect");
        },
        message_handler : function(message){
            console.log("received message at call " + message);
            var msg = JSON.parse(message);
            console.log(msg);
            if (msg.code == 100) {
                console.log("server->client: registered\n");
                call_state.dial("VIDEO");
            };
        }
    });
        return Call;
});
