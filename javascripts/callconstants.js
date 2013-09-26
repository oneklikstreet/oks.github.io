define (["underscore", "backbone"
    ], function(underscore, backbone ){

    return {
        FAIL: -1,
        IDLE: 0,
        OFFER_MADE: 1,
        ANSWERED: 2,
        HANGUP: 3,

        VIDEO: 0,
        AUDIO: 1,
        AUDIENCE: 2,

        call_type: { video: 'VIDEO', audio: 'AUDIO', audience: 'AUDIENCE'},
        call_state: { idle: 'IDLE', offer: 'OFFER_MADE', answer: 'ANSWERED', hangup: 'HANGUP'}
   }; 
});
