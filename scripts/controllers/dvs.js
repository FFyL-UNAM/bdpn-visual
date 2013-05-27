define(['config', 'lib/controllers', 'dvs/cloud'], function(config, Controller, cloud){

  return function(app){

    var dvs = new Controller(app);

    dvs.post('#/do', function(context){
      var type  = context.params.visualization
        , books = context.params.books;

      if(false === _.isArray(books)){
        books = [books];
      }

      books.forEach(function(bookId, i){
        books[i] = config.bdpn.host + '/api/' + bookId + '/tags';
      });

      switch(type) {
        case 'cloud':
        default:
          cloud(books, context);
      }

    });

    return dvs;

  }

});