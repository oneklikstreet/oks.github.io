define(["jquery","underscore", "backbone", "callstate", "callview", "media"], function ($,underscore, backbone, callstate, callview, media) {

    //console.log(_.random(0, 100));
    //  console.log($);
    var state = new CallState();
    var view = new CallView ({model: state, id: "test"});
    console.log("step 3");
    media.do_get_user_media("VIDEO", view.createPeerConnection);

});
