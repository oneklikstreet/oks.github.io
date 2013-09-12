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
    "underscore", "backbone", "channel", "call"
    ], function ( underscore, backbone, channel, call) {

                //console.log(_)
                //console.log(Backbone);
                //console.log(_.random(0, 100));
                console.log("step 1");
                var page = {};

                initialize = function() {
                    console.log("initialize loaded");
                    page.localVideo = document.getElementById("selfView");
                    page.remoteVideo = document.getElementById("remoteView");
                };
                
                open = function () {
                    console.log("step 2");
                    channel.openChannel(null);
                };

                initialize();
                open();
});
