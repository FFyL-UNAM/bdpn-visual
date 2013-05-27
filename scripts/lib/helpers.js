define(['jquery', 'config'], function($, config){

  var helpers = {};

  // dom ready!
  $(function(){

    helpers.setActiveLink = function(name) {
      var nav   = $('.page-header .nav')
        , links = nav.find('a[href="' + name + '"]')
        , home  = nav.find('a[href="/"]');

      nav.children().removeClass('active');
      links.parent().addClass('active');

      if('#/' === name)
        home.parent().addClass('active');
    }

    helpers.progressBar = function(){
      var html = '<div class="progress progress-striped active">'
                + '<div class="bar" style="width: 100%;"></div>'
                + '</div>';
      $(config.container).html(html);
    }

  });

  return helpers;

});