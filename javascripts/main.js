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
    "underscore", "backbone", "channel", "call"
    ], function ( underscore, backbone, channel, call) {

                console.log("mainjs loaded");
                var message_channel = new channel("119.81.19.90:8000");
                //message_channel.initialize("119.81.19.90:8000");
                var ourcall =  new call(message_channel);
                //ourcall.initialize(message_channel);
});
