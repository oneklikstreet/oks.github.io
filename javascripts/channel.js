define ( ["underscore"],  function (_) {

    var that = null;


    return {
        initialize : function() {
            console.log("channel is to be started are we here");
            this.socket = null;
            this.processMessage = null;
        },
        socket_connection_wait : 5,
        socketOpen : function() {
            that.socket.active = 1;
            console.log('socketOpen ' + 'web socket connection is successful\n');
            //video_call();
        },
        socketError : function(err) {
            this.socket.active = 0;
            console.log('socketError '+ 'web socket connection error'+err);
        },
        socketRecv : function(msg) {
            console.log('socketRecv Server: ' + msg.data);
            //processSignalingMessage(msg.data);
            //console.log("socket recv is called " + that.processMessage);
            try {
                //if((_.isUndefined(that.processMessage) || _.isNull(that.processMessage))){
                //    console.log('socketRecv ' + 'Null processMessage');
                //    return;
                //}
                that.processMessage(msg.data);
            } catch (e) {
                console.log(e.message);
            }
        },
        socketClose : function(msg) {
            this.socket.active = 0;
            console.log('socketClose ' + 'web socket is disconnected ' + msg);
        },
        openChannel: function (processMsg) {
            console.log('openChannel ' + 'Opening channel.');
            this.socket = new WebSocket('ws://119.81.19.90:8000/join_conf/', ['soap', 'xmpp', 'sip']);
            this.socket.binaryType = 'arraybuffer';
            this.processMessage = processMsg;
            this.socket.onopen = this.socketOpen;
            this.socket.onclose = this.socketClose;
            this.socket.onerror = this.socketError;
            this.socket.onmessage = this.socketRecv;
            that = this;
            return this;
        },
        sendMessage : function (msg) {
            if(that.socket.active){
                console.log('sendMessage ' + 'Browser -> Server: ' + msg);
                this.socket.send(msg);
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
    }

});
