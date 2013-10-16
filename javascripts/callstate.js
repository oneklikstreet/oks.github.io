define (["underscore", "backbone", "callconstants"],
        function(underscore, backbone , callconstants){
    
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
