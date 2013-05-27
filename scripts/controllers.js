define(['controllers/welcome', 'controllers/dvs'], function(welcome, dvs){

  var controllers = {}

  controllers.welcome = welcome;
  controllers.dvs     = dvs;

  return controllers;

});