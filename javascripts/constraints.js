define([], function(){

    return {
        video : {'mandatory': { 'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }},
        voice : {'mandatory': { 'OfferToReceiveAudio':true, 'OfferToReceiveVideo':false }},
        audience: {'mandatory': { 'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }}
    }
});
