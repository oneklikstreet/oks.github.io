define (["underscore", "backbone", "callconstants"], function(underscore, backbone , callconstants){

    //console.log(_.random(0, 100));

        // FAIL : -1,
        // IDLE : 0,
        // OFFER_MADE : 1,
        // ANSWERED : 2,
        // HANGUP : 3,

        // VIDEO : 0,
        // AUDIO : 1,
        // AUDIENCE : 2,

        // calltype : { video: 'VIDEO', audio: 'AUDIO', audience: 'AUDIENCE'},
        // callstate : { idle: 'IDLE', offer: 'OFFER_MADE', answer: 'ANSWERED', hangup: 'HANGUP'}
    
    CallState = Backbone.Model.extend({
        defaults: {
            "state": callconstants.FAIL,
            "type": callconstants.VIDEO
        },
        currentState: function() {
            return this.get('state');
        },
        currentType: function() {
            return this.get('type');
        },
        changeState: function(newState){
            this.set('state', newState);
            this.trigger("newState");
        },
        dial: function(callType){
            this.set('type', callType);
            this.trigger(calltype.video);
        }
    });
});
