require.config({
        baseUrl: "javascripts",
        paths: {
            "jquery": "jquery-1.10.2",
            "underscore": "underscore",
            "backbone": "backbone"
        },
       shim: {
           'backbone': {
           //These script dependencies should be loaded before loading
           //backbone.js
           deps: ['underscore', 'jquery'],
           //Once loaded, use the global 'backbone' as the
           //module value.
           exports: 'backbone'
           }
        },
        locale: "en"
    });

require([
    "underscore", "backbone", "channel", "call"
    ], function ( underscore, backbone, channel, call) {

        var VideoModel = Backbone.Model.extend( {} );
        var video1 = {};
        video1.model = new VideoModel( {
          item_class : "player",
          item_id : "localvideo",
          item_play : "autoplay",
          item_control : "controls"
        } );

        var video2 = {};
        video2.model = new VideoModel( {
          item_class : "player",
          item_id : "remotevideo",
          item_play : "autoplay",
          item_control : "controls"
        } );

        var VideoView = Backbone.View.extend( {
            tagName : 'video',
            attributes : function () {
                return {
                    class : this.model.get( 'item_class' ),
                    id : this.model.get( 'item_id' ),
                    autoplay : this.model.get ('item_play'),
                    controls : this.model.get ('item_control')
                };
            },
            render : function () {
                console.log('Let us render ' + this.model.get('item_id') );
                this.$el.html( "Video elements" );
                $( "#oks-container" ).append( this.el );
            }
          // attributes
        });

        video1.view = new VideoView( {
          model : video1.model
        } );

        video2.view = new VideoView( {
          model : video2.model
        } );
        video1.view.render();
        video2.view.render();

        console.log("mainjs loaded");
        var message_channel =  Object.create(channel);
        message_channel.initialize("119.81.19.90:8000");
        var ourcall = Object.create(call);
        call.initialize(message_channel);

});
