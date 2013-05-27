requirejs.config({
    paths: {
        'jquery'      : 'http://code.jquery.com/jquery-latest.min'
      , 'underscore'  : 'http://underscorejs.org/underscore-min'
      , 'sammy'       : 'https://raw.github.com/quirkey/sammy/master/lib/sammy'
      , 'sammy_hogan' : 'https://raw.github.com/quirkey/sammy/master/lib/plugins/sammy.hogan'
      , 'hogan'       : 'http://twitter.github.com/hogan.js/builds/2.0.0/hogan-2.0.0'
      , 'd3'          : 'http://d3js.org/d3.v3.min'
      , 'd3_cloud'    : 'https://raw.github.com/jasondavies/d3-cloud/master/d3.layout.cloud'
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