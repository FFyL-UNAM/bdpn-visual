define(['config', 'lib/controllers', 'dvs/cloud', 'dvs/bubble', 'dvs/chord'], function(config, Controller, cloud, bubble, chord){

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
        case 'chord':
          chord(books, context);
        break;
        case 'bubble':
          bubble(books, context);
        break;
        case 'cloud':
        default:
          cloud(books, context);
      }

    });

    return dvs;

  }

});