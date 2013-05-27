define(['config', 'lib/controllers'], function(config, Controller){

  return function(app){

    var welcome = new Controller(app);

    welcome.get('#/', function(context){
      context.load(config.bdpn.host + '/books?asJson=true', { dataType: 'jsonp' } )
              .then(function(docs){
                context.partial('templates/index.hg', { books: docs.books });
              });
    });

    return welcome;

  }

});