var width=1200,
    height=600,
    radius = Math.min(width, height)/2;

var color = d3.scale.category20();

var pie = d3.layout.pie()
    .value(function(d) {return d.budget2015; })
    .sort(null);

var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(radius-50);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate("+width/2+","+height/2+")");

d3.tsv("combinedbudget.tsv", type, function(error, data) {
    var path = svg.datum(data).selectAll('path')
        .data(pie)
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .each(function(d) { this._current = d; });

    path.append("text")
        .text(function(d) { return d.department; });
    d3.selectAll('input')
        .on("change", change);

    var timeout = setTimeout(function() {
        d3.select("input[value=\"budget2016\"]").property("checked", true).each(change);
    }, 2000);

    function change() {
        var value = this.value;
        clearTimeout(timeout);
        pie.value(function(d) { return d[value]; });
        path = path.data(pie);
        path.transition().duration(750).attrTween("d", arcTween);
    }
});

function type(d) {
    d.department = d.department;
    d.budget2015 = +d.budget2015;
    d.budget2016 = +d.budget2016;
    return d;
}

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}
