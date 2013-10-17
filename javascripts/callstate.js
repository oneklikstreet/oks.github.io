define (["underscore", "backbone", "callconstants"],
        function(underscore, backbone , callconstants){
    
    var CallState = Backbone.Model.extend({
        defaults: {
            "state": "FAIL",
            "type": callconstants.VIDEO
        },
        initialize: function(call_type) {
            this.set("type", call_type);
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
        dial: function(){
            this.changeState("IDLE");
        },
        answer: function(message){
            this.changeState("ANSWERED", message);
        },
        register: function() {
            this.changeState("REGISTER");
        },
        hangup: function() {
            this.changeState("HANGUP");
        }
                                    
    }); 
    return CallState;
});
