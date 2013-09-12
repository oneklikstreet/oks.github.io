define(["underscore", "backbone", "media", "callstate", "callview"], function (_, Backbone, media) {

    console.log(_.random(0, 100));
    var state = new CallState;
    var view = new CallView ({model: state});
    console.log("step 3");
    do_get_user_media("VIDEO", view.createPeerConnection);

});
