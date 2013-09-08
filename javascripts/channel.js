define ( [],  function () {


    var socket;
    var socketOpen = function() {
            socket.active = 1;
            console.log('web socket connection is successful\n');
            video_call();
        }

    var socketError = function(err) {
            socket.active = 0;
            console.log('web socket connection error'+err);
        }

    var socketRecv = function(msg) {
            console.log('Server:'+msg.data);
            processSignalingMessage(msg.data);
        }

    var socketClose = function(msg) {
            socket.active = 0;
            console.log('web socket is disconnected'+msg);
        }

    return {
        openChannel: function () {
            console.log("Opening channel.");
            socket = new WebSocket('ws://119.81.19.90:8000/join_conf/', ['soap', 'xmpp', 'sip']);
            socket.binaryType = 'arraybuffer';
            socket.onopen = socketOpen;
            socket.onclose = socketClose;
            socket.onerror = socketError;
            socket.onmessage = socketRecv;
       }
    }

});
