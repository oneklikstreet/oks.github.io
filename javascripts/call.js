define([ "underscore", "backbone","callstate", "callview", "channel", "callconstants" ],
       function (underscore, backbone, callstate, callview, channel, callconstants) {

/*
 user triggers call with "video"
 calljs triggers callstate with "idle"
 calljs triggers channel with "connect"
 channel triggers calljs with "connected"
 calljs triggers callsate with "offer"
 callstate trigggers media with "video"
 */

    var Call = Object.create (Backbone.Events);   
    _.extend(Call,  {
        call_channel : {},
        call_state : {},
        call_view : {},
        initialize : function(channel, call_type){
            call_channel = channel;
            call_state = new callstate(call_type);
            call_view = new callview({model: call_state});
            this.listenTo(call_channel, "CHANNEL_RECV", this.handleMessage);
            this.listenTo(call_view, "VIEW_CHANGE", this.send);
            call_channel.trigger("CHANNEL_CONNECT");
            console.log("Call initialized");
        },
        handleMessage : function(message){
            console.log("Call received message " + message);
            var msg = JSON.parse(message);
            switch(msg.code)
             {
                case 100:
                    console.log("Server -> Browser: channel setup\n");
                    call_state.register();
                break;
             
                case 150:
                    console.log("Server -> Browser: registered\n");
                break;
             
                case 155:
                    console.log("Server -> Browser: Call Initiate\n");
                    call_state.dial();
                break;
             
                case 200:
                    console.log("Server -> Browser:" + msg.body)
                    call_state.answer(msg);
                break;
             
                case 430:
                    console.log("Server -> Browser:" + msg.body);
                break;
             
                case 510:
                    console.log("Server -> Browser:" + msg.body);
                break;
             
                default:
                    console.log("Server -> Browser: Unknown msg received " + msg.code);
             
             }
             /*
            if (msg.code == 100) {
                console.log("server->client: registered\n");
                call_state.dial(callconstants.VIDEO);
            } else if(msg.code == 200) {
                console.log("server->client:" + msg.body)
                call_state.answer(msg);
            }
              */
        },
        send : function (message){
            console.log("Call sending message " + message);
            call_channel.sendMessage(message);
        }
    });
    return Call;
});
