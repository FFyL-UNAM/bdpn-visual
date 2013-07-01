define(['config', 'd3'], function(config, d3){
  
  var generate = function(selector, data){

    var groups = data.groups
      , labels = data.labels
      , matrix = data.matrix;

    // fix the matrix
    var value      = []
      , new_matrix = [];

    for (var i = matrix.length - 1; i >= 0; i--) {
      value.push(matrix[i].length);
    };

    for (var i = 0; i < groups.length; i++) {
      var submatrix = [];
      for (var j = 0; j < groups.length; j++) {
        if(matrix[i] && matrix[i][j]) {
          submatrix.push(matrix[i][j]);
        } else {
          submatrix.push(0);
        }
      }
      new_matrix.push(submatrix);
    }

    // set options
    var diameter    = 767
      , innerRadius = 0.42 * Math.min(diameter, diameter)
      , outerRadius = 1.1 * innerRadius;

    // set scales
    var fill = d3.scale.ordinal()
                  .domain([0, 2])
                  .range(["#A28A7F", "#D89D59", "#657480", "#D4C553"]);

    // set layout chord
    var layout = d3.layout.chord()
                    .padding(.1)
                    .sortGroups(d3.descending)
                    .sortSubgroups(d3.ascending)
                    .sortChords(d3.ascending)
                    .matrix(new_matrix);

    // set arc
    var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

    // set chord
    var chord = d3.svg.chord()
                  .radius(innerRadius);

    // create svg element
    var svg = d3.select(selector)
                  .append("svg")
                    .attr("width", diameter)
                    .attr("height", diameter)
                      .append("g")
                        .attr("transform", "translate(" + diameter / 2 + ", " + diameter / 2 + ")");

    // set the groups arc
    var group = svg.selectAll(".group")
                    .data(layout.groups)
                      .enter().append("g")
                        .attr("class", "group");

    // add a mouseover title
    group.append("title").text(function(d, i) {
      return groups[d.index];
    });

    // create the group arc
    var groupPath = group.append("path")
                          .attr("id", function(d, i) { return "group" + i; })
                          .attr("d", arc)
                          .style("fill", function(d,i) { return fill(i); })
                          .style("stroke", function(d,i) { return d3.rgb(fill(i)).darker(); })
                          .on("mouseover", fade(.1))
                          .on("mouseout", fade(1));

    // create a text label to groups arc
    group.append("text")
          .attr("x", 8)
          .attr("dy", 21)
            .append("textPath")
              .attr("xlink:href", function(d, i) { return "#group" + i; })
              .text(function(d, i) { return groups[d.index]; })
              .on("mouseover", fade(.1))
              .on("mouseout", fade(1))
              .filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
                .remove();

    // set chords
    svg.append("g").attr("class", "chord")
                .selectAll("path")
                .data(function(){
                  if(data.clean){
                    return createChords();
                  } else {
                    return layout.chords();
                  }
                })
                    .enter().append("path")
                        .attr("d", chord)
                        .style("fill", function(d) { return fill(d.target.index); })
                .data(layout.chords)
                  .append("title")
                    .text(function(d){

                      if(labels[d.source.index]) {
                        label_source = labels[d.source.index][d.source.subindex];
                      }

                      if(label_source) {
                        return label_source;
                      }

                    });

    // set ticks
    var tick = svg.append("g").selectAll("g.tick")
                    .data(layout.groups)
                      .enter().append("g").selectAll("g")
                        .data(groupTicks)
                          .enter().append("g")
                            .attr("transform", function(d){
                              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                                    + "translate(" + outerRadius + ",0)";
                            });

    // add lines to ticks
    tick.append("line")
        .attr("x1", 1)
        .attr("y1", 0)
        .attr("x2", function(d){
          if(d.label) {
            return 10;
          } else {
            return 5;
          }
        })
        .attr("y2", 0)
        .style("stroke", "#000");

    // add text to ticks
    tick.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-24)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .style("font-size", 10)
        .text(function(d) { return d.label; });

    // groupTicks
    function groupTicks(d) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, 10).map(function(v, i) {
        var label = d.value == v ;
        return {
          angle: v * k + d.startAngle,
          label: i % 5 ? null : v
        };
      });
    }

    // create chords to specific targets 
    function createChords(){
      var chords = layout.chords();

      // remove targets
      chords.forEach(function(c, i){
        c.label  = labels[c.source.index][c.source.subindex];
        c.target = c.source;
      });

      // link between labels
      chords.forEach(function(c, i){
        var even = _.find(chords, function(needle){
          if (c.label === needle.label) {
            return needle;
          }
        });

        if(even){
          c.target = even.target;
        }

      });

      return chords;
    }

    // fade chords
    function fade(opacity) {
      return function(g, i) {
        svg.selectAll(".chord path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
            .style("opacity", opacity)
            .duration(500);
      };
    }

  }

  var chord = function(books, context){

    var groups = []
      , labels = []
      , matrix = [];

    _(books).each(function(id){

      var url      = config.bdpn.host + '/books/' + id + '?asJson=true'
        , url_tags = config.bdpn.host + '/api/' + id + '/tags';
      
      context.load(url, { dataType: 'jsonp' })
              .then(function(doc){

                groups.push(doc.book.name);

                var sublabels = []
                  , submatrix = [];

                context.load(url_tags, { dataType: 'jsonp' })
                        .then(function(docs){

                          var names  = _.flatten(docs.name)
                            , extend = {}
                            , name   = [];

                          _(names).each(function(n){
                            _.extend(extend, n);
                          });

                          _(extend).map(function(v, k){
                            name.push({ name: k, value: v });
                          });

                          name.sort(function(a, b) {
                            return b.value - a.value;
                          });

                          _(name).each(function(item){
                            sublabels.push(item.name);
                            submatrix.push(item.value);
                          });
                          

                          labels.push(sublabels);
                          matrix.push(submatrix);

                          if (matrix.length === books.length) {

                            context.partial('templates/chords.hg', {}, function(){
                              
                              generate('#chord', {
                                  groups: groups
                                , labels: labels
                                , matrix: matrix
                              });
                              generate('#chord-names', {
                                  groups: groups
                                , labels: labels
                                , matrix: matrix
                                , clean: true
                              });

                            });

                          }

                        });

              });
    });

  }

  return chord;

});