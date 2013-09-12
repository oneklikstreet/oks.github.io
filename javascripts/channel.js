define ( ["underscore"],  function (_) {

    var socket;
    var processMessage = null;
    socketOpen = function() {
            socket.active = 1;
            console.log('socketOpen ' + 'web socket connection is successful\n');
            //video_call();
        }

    socketError = function(err) {
            socket.active = 0;
            console.log('socketError '+ 'web socket connection error'+err);
        }

    socketRecv = function(msg) {
            console.log('socketRecv Server: ' + msg.data);
            //processSignalingMessage(msg.data);
            try {
            if((_.isUndefined(this.processMessage) || _.isNull(this.processMessage)))
                console.log('socketRecv ' + 'Null processMessage');
                return;
            this.processMessage(msg.data);
            } catch (e) {
                console.log(e.message);
            }
        }

    socketClose = function(msg) {
            socket.active = 0;
            console.log('socketClose ' + 'web socket is disconnected ' + msg);
        }

    return {
        openChannel: function (processMsg) {
            console.log('openChannel ' + 'Opening channel.');
            socket = new WebSocket('ws://119.81.19.90:8000/join_conf/', ['soap', 'xmpp', 'sip']);
            socket.binaryType = 'arraybuffer';
            this.processMessage = processMsg;
            socket.onopen = socketOpen;
            socket.onclose = socketClose;
            socket.onerror = socketError;
            socket.onmessage = socketRecv;
        },
        sendMessage : function (msg) {
            if(socket.active){
                console.log('sendMessage ' + 'Browser -> Server: ' + msg);
                socket.send(msg);
            } else {
                if(socket_connection_wait){
                    socket_connection_wait -= 1;
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
