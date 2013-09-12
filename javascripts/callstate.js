define (['backbone'], function(Backbone){

    var IDLE = 0;
    var OFFER_MADE = 1;
    var ANSWERED = 2;
    var HANGUP = 3;

    var VIDEO = 0;
    var AUDIO = 1;
    var AUDIENCE = 2;

    var calltype = { video: 'VIDEO', audio: 'AUDIO', audience: 'AUDIENCE'};
    var callstate = { idle: 'IDLE', offer: 'OFFER_MADE', answer: 'ANSWERED', hangup: 'HANGUP'};
    
    CallState = Backbone.Model.extend({
        defaults : {
            state: IDLE,
            type: VIDEO
        },
        currentState: function() {
            return this.get('state');
        },
        currentType: function() {
            return this.get('type');
        },
        changeState: function(newState){
            this.set('state', newState);
        },
        changeType: function(newType){
            this.set('type', newType);
            this.trigger(calltype.video);
        }
    });
});
