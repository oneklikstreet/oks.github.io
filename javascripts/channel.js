define ( ["underscore", "backbone", "signaling"],  function (underscore, backbone, signaling) {

    return function () {
    var Channel = {};
    _.extend(Channel, Backbone.Events, {
        socket : {},
        server_address : {},
        active : 0,
        socket_connection_wait : 5,
        initialize : function(address) {
            console.log("channel is to be started are we here");
            socket = null;
            server_address = address;
            this.on("connect", this.openChannel);
            this.socketRecv = _.bind(this.socketRecv, this);
            this.socketOpen = _.bind(this.socketOpen, this);
            this.socketError = _.bind(this.socketError, this);
            this.socketClose = _.bind(this.socketClose, this);
        },
        socketOpen : function() {
            active = 1;
            console.log('socketOpen ' + 'web socket connection is successful');
        },
        socketError : function(error) {
            active = 0;
            console.log('socketError '+ 'web socket connection error ' + error);
        },
        socketRecv : function(msg) {
            console.log('socketRecv Server: ' + msg.data);
            try {
                this.trigger("message_in", msg.data);
            } catch (e) {
                console.log(e.message);
            }
        },
        socketClose : function(msg) {
            active = 0;
            console.log('socketClose ' + 'web socket is disconnected ' + msg);
        },
        openChannel: function () {
            console.log('openChannel ' + 'Opening channel.');
            socket = new WebSocket('ws://' + server_address + '/join_conf/', ['soap', 'xmpp', 'sip']);
            socket.binaryType = 'arraybuffer';
            socket.onopen = this.socketOpen;
            socket.onclose = this.socketClose;
            socket.onerror = this.socketError;
            socket.onmessage = this.socketRecv;
        },
        sendMessage : function (msg) {
            if(active){
                console.log('sendMessage ' + 'Browser -> Server: ' + msg);
                socket.send(msg);
            } else {
                if(this.socket_connection_wait){
                    this.socket_connection_wait -= 1;
                    //waiting for connection to get ready
                    setTimeout( function() { 
                                console.log('sendMessage ' + "waiting for connection\n"); 
                                sendMessage(msg);
                            }, 
                                1000);
                    return;
                }
                console.log('sendMessage ' + ' Error: Lost connection with the service. Please check your network setttings.');
                alert(' Error: Lost connection with the service. Please check your network setttings.');
            }
        }
    
    });
return Channel;
}
});
