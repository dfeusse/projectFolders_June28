var w = 1056,
    h = 1000,
    r = 920,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;

var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; })

var vis = d3.select("#viz").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");
    
//var color = d3.scale.category20b();
  	var color = d3.scale.ordinal()
		.domain(["N", "Y"])
		//.range(["#990000", "rgb(255,0,0)"]);


d3.json("NetflixBubbleData.json", function(data) {
  node = root = data;

  var nodes = pack.nodes(root);

  vis.selectAll("circle")
      .data(nodes)
    .enter().append("svg:circle")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; })
      .on("click", function(d) { return zoom(node == d ? root : d); })
      .style("stroke", function(d) { return color(d.pone); });
      //.style("fill", function (d) {return color(d.pone); });

  vis.selectAll("text")
      .data(nodes)
    .enter().append("svg:text")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("opacity", function(d) { return d.r > 22 ? 1 : 0; })
      .text(function(d) { return d.name; });

      //.style("font-size", "12px")
     //.style("font-size", function(d) { return (2 * d.r - 8) / this.getComputedTextLength() * 12 + "px"; })

  d3.select(window).on("click", function() { zoom(root); });
});

function zoom(d, i) {
  var k = r / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      //.attr("fill", function (d) {return color(d.parent); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return k * d.r > 22 ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}


  $('svg circle').tipsy({
    html: true,
    live: true,
    fade: true,
    gravity: 'sw',
    title: function () {
      //return "pone";
      var d = this.__data__;
      return d.name;
      }
    });
