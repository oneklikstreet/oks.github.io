require.config({
        baseUrl: "javascripts",
        paths: {
            "jquery": "jquery-1.10.2",
            "underscore": "underscore",
            "backbone": "backbone"
        },
        locale: "en"
    });

require([
    "underscore", "backbone", "channel", "call"
    ], function ( underscore, backbone, channel, call) {



        var ItemModel = Backbone.Model.extend( {} );

        var item1 = {};
        item1.model = new ItemModel( {
          item_class : "player",
          item_id : "localvideo",
          item_play : "autoplay",
          item_control : "controls"
        } );

        var item2 = {};
        item2.model = new ItemModel( {
          item_class : "player",
          item_id : "remotevideo",
          item_play : "autoplay",
          item_control : "controls"
        } );

        var ItemView = Backbone.View.extend( {
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
                console.log('hey the render is called!');
                this.$el.html( "Some stuff" );
                $( "#oks-container" ).append( this.el );
            }
          // attributes
        });

        item1.view = new ItemView( {
          model : item1.model
        } );

        item2.view = new ItemView( {
          model : item2.model
        } );
        item1.view.render();
        item2.view.render();

        console.log("mainjs loaded");
        var message_channel =  Object.create(channel);
        message_channel.initialize("119.81.19.90:8000");
        var ourcall =  new call(message_channel);

});
