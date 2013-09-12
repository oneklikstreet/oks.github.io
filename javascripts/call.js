define(["backbone", "underscore", "media"], function (Backbone, _, media) {

    var state = new CallState;
    var view = new CallView ({model: state});
    console.log("step 3");
    do_get_user_media("VIDEO", view.createPeerConnection);

});
