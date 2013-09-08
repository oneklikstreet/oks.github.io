define ( [],  function () {

    var socket;
    var processMessage;
    var socketOpen = function() {
            socket.active = 1;
            console.log('web socket connection is successful\n');
            //video_call();
        }

    var socketError = function(err) {
            socket.active = 0;
            console.log('web socket connection error'+err);
        }

    var socketRecv = function(msg) {
            console.log('Server:'+msg.data);
            //processSignalingMessage(msg.data);
            processMessage(msg.data);
        }

    var socketClose = function(msg) {
            socket.active = 0;
            console.log('web socket is disconnected ' + msg);
        }

    return {
        openChannel: function (processMsg) {
            console.log("Opening channel.");
            socket = new WebSocket('ws://119.81.19.90:8000/join_conf/', ['soap', 'xmpp', 'sip']);
            socket.binaryType = 'arraybuffer';
            processMessage = processMsg;
            socket.onopen = socketOpen;
            socket.onclose = socketClose;
            socket.onerror = socketError;
            socket.onmessage = socketRecv;
        },
        sendMessage : function (msg) {
            if(socket.active){
                console.log('Browser -> Server' + msg);
                socket.send(msg);
            } else {
                if(socket_connection_wait){
                    socket_connection_wait -= 1;
                    //waiting for connection to get ready
                    setTimeout( function() { 
                                    console.log("waiting for connection\n"); 
                                    sendMessage(msg);
                                    }, 
                                1000);
                    return;
                }
                console.log(' Error: Lost connection with the service. Please check your network setttings.');
                alert(' Error: Lost connection with the service. Please check your network setttings.');
            }
        }
    }

});
