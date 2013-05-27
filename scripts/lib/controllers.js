define(['lib/helpers'], function(helpers){
  var Controller = function(app){

    var controller = {};

    controller.add = function(route, method, callback_callback){

      var callback = function(context){
        helpers.setActiveLink(route);
        helpers.progressBar();
        callback_callback(context);
      };

      switch(method) {
        case 'post':
          app.post(route, callback);
        break;
        default:
          app.get(route, callback);
      }

    }

    controller.get = function(route, callback){
      this.add(route, 'get', callback);
    };

    controller.post = function(route, callback){
      this.add(route, 'post', callback);
    };

    return controller;

  }
  return Controller;
});