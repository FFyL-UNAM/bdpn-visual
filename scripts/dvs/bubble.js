define(['config', 'd3', 'tooltip'], function(config, d3){
  
  var generate = function(selector, words){


    var diameter  = 767
      , fill      = d3.scale.category10();

    var bubble = d3.layout.pack()
                  .size([diameter, diameter])
                  .padding(1.5);

    var svg = d3.select(selector).append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble");

    var node = svg.selectAll('g.node')
                  .data(bubble.nodes(words)
                    .filter(function(d){ return !d.children; }))
                  .enter().append("svg:g")
                  .attr("class", "node")
                  .attr("title", "tooltip")
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                  .tooltip(function(d, i) {
                    var r, svg;
                    r = +d3.select(this).attr('r');
                    svg = d3.select(document.createElement("svg")).attr("height", 50);
                    g = svg.append("g");
                    g.append("rect").attr("width", r * 10).attr("height", 10);
                    g.append("text").text(d.text).attr("dy", "25");
                    return {
                      type: "tooltip",
                      text: d.text,
                      detection: "shape",
                      placement: "fixed",
                      gravity: "right",
                      position: [d.x, d.y],
                      displacement: [r + 2, -20],
                      mousemove: true
                    };
                  });

    var circle = node.append('circle')
                      .attr("r", function(d){ return d.r; })
                      .style("fill", function(d) { return fill(d.subterm); })

    d3.select(self.frameElement).style("height", diameter + "px");

  }

  var bubble = function(books, context){

    var names = {};

    _(books).each(function(url, i){

      context.load(url, { dataType: 'jsonp' })
              .then(function(docs){

                  names.children  = [];

                  _( _.flatten(docs.name) ).each(function(items, group){

                    names.children[group]       = {};
                    names.children[group].value = 0;

                    _(items).each(function(value, key){
                      names.children[group]['children'] = names.children[group]['children'] || [];
                      names.children[group]['children'].push({ text: key, value: value, subterm: group });
                      names.children[group].value = names.children[group].value + value;
                    });

                    names.children[group]['children'].sort(function(a, b) {
                      return b.value - a.value;
                    });

                    names.children[group]['children'] = _.filter(names.children[group]['children'], function(item, i) {
                      if (i < 30) return item;
                    });

                  });

                  if (i === books.length - 1) {

                    context.partial('templates/bubble.hg', {}, function(){
                      
                      generate('#bubble-names', names);

                    });

                  }

              });
    });

  }

  return bubble;

});