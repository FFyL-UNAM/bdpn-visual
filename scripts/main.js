requirejs.config({
    paths: {
        'jquery'      : '../bower_components/jquery/jquery.min'
      , 'underscore'  : '../bower_components/underscore/underscore-min'
      , 'sammy'       : '../bower_components/sammy/lib/min/sammy-latest.min'
      , 'sammy_hogan' : 'https://raw.github.com/quirkey/sammy/master/lib/plugins/sammy.hogan'
      , 'hogan'       : '../bower_components/hogan/web/1.0.0/hogan.min'
      , 'd3'          : '../bower_components/d3/d3.min'
      , 'd3_cloud'    : 'd3.layout.cloud'
    }
  , shim: {
        sammy: {
            deps: ['jquery']
        }
      , underscore: {
            exports: '_'
        }
      , d3: {
            exports: 'd3'
        }
      , d3_cloud: {
            deps: ['d3']
        }
    }
});

require(
    [
        'jquery'
      , 'underscore'
      , 'sammy'
      , 'sammy_hogan'
      , 'config'
      , 'controllers'
    ]
  , function($, _, Sammy, hogan, config, controllers){

      $(function(){
        // set app
        var app = Sammy(config.container);

        // template engine
        app.use('Hogan', 'hg');

        // controllers
        var controller_welcome = controllers.welcome(app);
        var controller_dvs     = controllers.dvs(app);

        // run app =)
        app.run('#/');

        // some
        $('body').on('click', '.select-all', function(e){
                  $('.books input[type="checkbox"]').prop('checked', true);
                  e.preventDefault();
                })
                .on('click', '.deselect-all', function(e){
                  $('.books input[type="checkbox"]').prop('checked', false);
                  e.preventDefault();
                });


      });

    }
);