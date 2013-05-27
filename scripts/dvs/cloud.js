define(['config', 'd3', 'd3_cloud'], function(config, d3){
  
  var generate = function(selector, words){

    var width   = 767
      , height  = 350
      , scale   = 1;

    // sort
    words.sort(function(a, b) {
      return b.value - a.value;
    });

    // add limit
    words = _.filter(words, function(item, i) {
      if (i < 100) return item;
    });

    var fill   = d3.scale.category20()
      , size   = d3.scale.linear()
                  .domain([0, d3.max(words, function(d){ return d.value; })])
                  .range([14, 100])
      , svg    = d3.select(selector)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
      , bg     = svg.append("g")
      , vis    = svg.append("g")
                  .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
      , layout = d3.layout.cloud()
                  .timeInterval(10)
                  .size([width, height])
                  .fontSize(function(d) { return size(+d.value); })
                  .words(words)
                  .on("end", draw)
                  .font('Helvetica')
                  .spiral('archimedean')
                  .start();

    function draw(words) {
      var text = vis.selectAll('text')
                    .data(words)
      text.enter().append("text")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
          .style("font-size", function(d) { return d.size + "px"; })
          .style("opacity", 1e-6)
          .transition()
            .duration(2000)
            .style("opacity", 1);
      text.style("font-family", function(d) { return d.font; })
          .style("fill", function(d) { return fill(d.text); })
          .text(function(d) { return d.text; });
    }
    
  };

  var cloud = function(books, context){

      var names = []
        , terms = [];
      
      _(books).each(function(url, i){
        context.load(url, { dataType: 'jsonp' })
                .then(function(docs){

                  _( _.flatten(docs.name) ).each(function(items) {
                    _(items).each(function(value, key){
                      names.push({ text: key, value: value });
                    });
                  });

                  _( _.flatten(docs.term) ).each(function(items) {
                    _(items).each(function(value, key){
                      terms.push({ text: key, value: value });
                    });
                  });

                  if (i === books.length - 1) {
                    
                    context.partial('templates/tagcloud.hg', {}, function(){
                      
                      generate('#cloud-names', names);
                      generate('#cloud-terms', terms);

                    });

                  }
                });
      });

  };

  return cloud;

});