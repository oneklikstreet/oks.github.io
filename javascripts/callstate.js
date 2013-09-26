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
    
    var CallState = Backbone.Model.extend({
        defaults: {
            "state": "FAIL",
            "type": callconstants.VIDEO
        },
        currentState: function() {
            return this.get('state');
        },
        currentType: function() {
            return this.get('type');
        },
        changeState: function(state){
            console.log("current state " + this.get('state') + " new state " + state);
            this.set('state', state);
            this.trigger(state, arguments[1]);
        },
        dial: function(calltype){
            this.set('type', calltype);
            this.changeState("IDLE");
        },
        answer: function(message){
            this.changeState("ANSWERED", message);
        }
    }); 
    return CallState;
});
