require.config(
    {
        baseUrl: "javascripts",
        paths: {
            "backbone": "backbone",
            "underscore": "underscore"
        },
        locale: "en"
    }
);

require(['underscore', 'backbone'], function(_, Backbone) {

                if (typeof _ === 'undefined') {
                    _ = require('underscore');
                    console.log("what??!!");
                    console.log(_);
                }
                 if (!_ && (typeof require !== 'undefined')) _ = require('underscore');
                 console.log(_)
                    console.log(_.random(0, 100));

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
