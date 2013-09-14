define (["underscore", "backbone", "callconstants"], function(underscore, backbone , callconstants){

    //console.log(_.random(0, 100));
    
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
        },
        changeType: function(newType){
            this.set('type', newType);
            this.trigger(calltype.video);
        }
    });
});
