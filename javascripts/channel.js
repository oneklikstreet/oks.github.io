define (["underscore", "backbone"],
        function (underscore, backbone){

        var Channel = Object.create (Backbone.Events);
        _.extend(Channel, {
            socket : {},
            server_address : {},
            active : 0,
            socket_connection_wait : 5,
            initialize : function(address) {
                socket = null;
                server_address = address;
                this.on("CHANNEL_CONNECT", this.openChannel);
                this.socketRecv = _.bind(this.socketRecv, this);
                this.socketOpen = _.bind(this.socketOpen, this);
                this.socketError = _.bind(this.socketError, this);
                this.socketClose = _.bind(this.socketClose, this);
                console.log("Channel initialized");
            },
            socketOpen : function() {
                active = 1;
                console.log('socketOpen ' + 'web socket connection is successful');
            },
            socketError : function(error) {
                active = 0;
                console.log('socketError '+ 'web socket connection error ' + error);
            },
            socketRecv : function(message) {
                 //console.log('socketRecv: ' + message.data);
                 this.trigger("CHANNEL_RECV", message.data);
            },
            socketClose : function(msg) {
                 active = 0;
                 console.log('socketClose ' + 'web socket is disconnected ' + msg);
            },
            openChannel: function () {
                 console.log('openChannel ' + 'Opening channel.');
                 socket = new WebSocket('ws://' + server_address + '/join_conf/');
                 socket.binaryType = 'arraybuffer';
                 socket.onopen = this.socketOpen;
                 socket.onclose = this.socketClose;
                 socket.onerror = this.socketError;
                 socket.onmessage = this.socketRecv;
            },
            sendMessage : function (msg) {
                 if(active){
                    console.log('Browser -> Server: ' + msg);
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
});
