define(['config', 'd3'], function(config, d3){
  
  var generate = function(selector, data){

    if(!data.matrix) return;

    var chord = d3.layout.chord()
                        .padding(.05)
                        .sortGroups(d3.descending)
                        .sortSubgroups(d3.descending)
                        .sortChords(d3.descending)
                        .matrix(data.matrix);

    var diameter    = 767,
        innerRadius = Math.min(diameter, diameter) * .35,
        outerRadius = innerRadius * 1.15;

    var fill = d3.scale.category10();

    var svg = d3.select(selector).append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
      .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    svg.append("g").selectAll("path")
        .data(chord.groups)
      .enter().append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    var ticks = svg.append("g").selectAll("g")
        .data(chord.groups)
      .enter().append("g").selectAll("g")
        .data(groupTicks)
      .enter().append("g")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + outerRadius + ",0)";
        });

    ticks.append("line")
        .attr("x1", 1)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 0)
        .style("stroke", "#000");

    ticks.append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .text(function(d) { return d.label; });

    svg.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); });

    function groupTicks(d) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value).map(function(v, n) {
        console.log(d.subindex);
        return {
          angle: v * k + d.startAngle,
          label: data.labels[d.index]
        };
      });
    }

    function fade(opacity) {
      return function(g, i) {
        console.log(i);
        svg.selectAll(".chord path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
            .style("opacity", opacity);
      };
    }

  }

  var chord = function(books, context){

    var data = {
        labels: []
      , matrix: []
    };

    _(books).each(function(url, i){

      context.load(url, { dataType: 'jsonp' })
              .then(function(docs){

                $.each( docs.name, function(item, group) {

                  var submatrix = [];

                  _(docs.name[item]).each(function(value, key){
                    data.labels.push(key);
                    submatrix.push(value);
                  });

                  submatrix.sort(function(a, b) {
                    return b - a;
                  });
                  
                  data.matrix.push(submatrix);

                });

                if (i === books.length - 1) {

                  var matrix = [];
                  _(data.matrix).each(function(a){

                    if(a.length > 5) {
                      var c = [];
                      _(a).each(function(b){
                        if(c.length < 5) {
                          c.push(b);
                        }
                      });
                      matrix.push(c);
                    }

                  });

                  data.matrix = matrix;

                  context.partial('templates/bubble.hg',   {}, function(){
                    
                    generate('#bubble-names', data);

                  });

                }

              });
    });

  }

  return chord;

});