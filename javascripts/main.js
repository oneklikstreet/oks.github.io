require.config({
        baseUrl: "javascripts",
        paths: {
            "jquery": "jquery-1.10.2",
            "underscore": "underscore",
            "backbone": "backbone"
        },
        locale: "en"
    });

require([
    "underscore", "backbone", "channel", "call", "signaling"
    ], function ( underscore, backbone, channel, call, signaling) {

                var message_channel = {};            
                console.log("mainjs loaded");
                message_channel = new channel();
                message_channel.initialize("119.81.19.90:8000");
                message_channel.trigger("connect");
                call.callStart(message_channel);
});
