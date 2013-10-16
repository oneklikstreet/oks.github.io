require.config({
        baseUrl: "javascripts",
        paths: {
            "jquery": "jquery-1.10.2",
            "underscore": "underscore",
            "backbone": "backbone"
        },
       shim: {
           'backbone': {
               /* These script dependencies should be loaded
               before loading backbone.js */
               deps: ['underscore', 'jquery'],
               /* Once loaded, use the global 'backbone' as the
               module value.*/
               exports: 'backbone'
           }
        },
        locale: "en"
    });

require(["underscore", "backbone", "channel", "call"],
        function ( underscore, backbone, channel, call) {

        console.log("oks mainjs loaded");

        var VideoModel = Backbone.Model.extend( {} );
        
        var localvideo = {};
        localvideo.model = new VideoModel( {
          item_class : "player",
          item_id : "localvideo",
          item_play : "autoplay",
          //item_control : "controls"
        } );

        var remotevideo = {};
        remotevideo.model = new VideoModel( {
          item_class : "player",
          item_id : "remotevideo",
          item_play : "autoplay",
          //item_control : "controls"
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
        });

        localvideo.view = new VideoView( {
          model : localvideo.model
        } );

        remotevideo.view = new VideoView( {
          model : remotevideo.model
        } );
        //localvideo.view.render();
        remotevideo.view.render();

        var message_channel =  Object.create(channel);
        message_channel.initialize("119.81.19.90:8000");
        console.log("message_channel initialized");

        var ourcall = Object.create(call);
        call.initialize(message_channel);

});
