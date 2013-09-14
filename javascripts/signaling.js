define([], function() {

    return {
        processSignalingMessage : function (message) {
            var msg = JSON.parse(message);

            if (msg.code == 100) {
                console.log("server->client: registered\n")
            } else if(msg.code == 200) {
                //if(call_state == OFFER_MADE) {
                //    call_state == ANSWERED;
                    pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.body }));    
                  //  if(mode == RECORD){
                  //      socketSend(record_msg);
                //    }
                //}else if(call_state == HANGUP) {
                  //  call_state = IDLE;
                    console.log("server->client:" + msg.body)
                //}
            } else if (msg.code == 502) {
                console.log(" Error: Unable to connect video/voice. Please check firewall policy on the system or with network service provider");
                hang_up(0);
                call_state = IDLE;
                alert(" Error: Unable to connect video/voice. Please check firewall policy on the system or with network service provider");
            } else if(msg.code == 430){
                var size = 0;
                for (i=0;i<4;i++){       
                    if( msg.body[i] != 0){ 
                        size = size +1 ;
                        
                        if (call_list.indexOf(msg.body[i]) == -1){
                            showuser(String(i+1));
                        }
                        call_list.push(msg.body[i]);
                        console.log(call_list);
                        if(msg.body[i].indexOf(msg.callid) != -1 && msg.body[i].indexOf(msg.fromtag)){
                            var selfview_id = i;
                            console.log("self :"+ i);
                        }
                     }
                    else{
                        console.log("hide :"+ i);
                    }
                }
                console.log("size" + size);
                if(size == 1){
                }
                else{
                }
            } else if(msg.code == 503) {
                hang_up (0);
                alert("Your bandwidth is low for a video call, switching call to voice only");
                call_state = IDLE;
                voice_call();
            } else if(msg.code == 490) {
                alert("recording is already in progess");
            } else if(msg.code == 491) {
                alert("record name is missing");
            } else if(msg.code == 492) {
                alert("recording started");
            } else if(msg.code == 505) {
                hang_up(0);
                alert("Chrome has stopped sending audio packets. Please rejoin the conference");
                call_state = IDLE;
            } else if(msg.code == 500) {
                console.log("server->client:"+ msg.code + msg.body);
                if (alert_count == 0 ){
                    alert("Conference full");
                    alert_count = 1;
                }
                call_state = IDLE;
            }
             else if(msg.code == 501) {
                console.log("server->client:"+ msg.code + msg.body);
                if (alert_count == 0 ){
                    alert("Our servers have reached the maximum capacity.Please try after sometime.");
                    alert_count = 1;
                }
                call_state = IDLE;
            }
             else {
                console.log("server->client:"+ msg.code + msg.body)
            }
        }
    }
});
