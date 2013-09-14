require.config(
    {
        baseUrl: "javascripts",
        paths: {
            "jquery": "jquery-1.10.2",
            "underscore": "underscore",
            "backbone": "backbone"
        },
        locale: "en"
    }
);

require([
    "underscore", "backbone", "channel", "call", "signaling"
    ], function ( underscore, backbone, channel, call, signaling) {

                //console.log(_)
                //console.log(Backbone);
                //console.log(_.random(0, 100));
                console.log("step 1");
                var page = {};

                initialize = function() {
                    console.log("initialize loaded");
                };
                
                open = function () {
                    console.log("step 2");
                    message_channel = channel.openChannel(signaling.processSignalingMessage);
                    //console.log(message_channel);
                    return message_channel;
                };

                initialize();
                //open();
                call.callStart(open());
});
