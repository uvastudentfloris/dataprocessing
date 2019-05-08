// Floris van Lith
// 10793917

d3.select("body").append("h2").text("Barchart renewables");
d3.select("body").append("h3").text("Floris van Lith - 10793917");
d3.select("body").append("h4").text("Bars indicate the share of renewable energy per year in kilotonnes of oil equivalent (KTOE) in Denmark");

// dimensions of SVG area
var w = 500;
var h = 300;
var barPadding = 1;
var margin = {top: 40, right: 20, bottom: 30, left: 40}

// create div for tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data from json file, analysis of Denmark
d3.json("data.json").then(function(data){
  required_data= [];
  for(i = 0; i < data.length; i++){
    if (data[i].LOCATION == "DNK" && data[i].TIME > "1970" && data[i].MEASURE == "KTOE"){
      required_data.push(data[i])
    }
  }

// create scale to map x values on SVG
 var xScale = d3.scaleLinear()
   .domain([d3.min(required_data, function(d) { return d.TIME; }), d3.max(required_data, function(d) { return d.TIME; })])
   .range([0, w]);

 // create scale to map y values on SVG
 var yScale = d3.scaleLinear()
          .domain([0, 4956.394])
          .range([0, h]);

// values for y axis, upside down
var yAxis = d3.scaleLinear()
         .domain([0, 5000])
         .range([h, 0]);

// tick values for x-axis
tick_x = []
for (i = 1971; i <= 2016; i++){
  tick_x.push(i)
};

  // generate rects
  svg.selectAll("rect")
    .data(required_data)
    .enter()
    .append("rect")
    .attr("x", function(d) {return xScale(d.TIME);})
    .attr("y", function(d) {return (h - yScale(d.Value));})
    .attr("width", w / required_data.length - barPadding)
    .attr("height", function(d) {return yScale(d.Value);})
    .attr("class", "bar")
    .on('mouseover', d => {
     div
       .transition()
       .duration(200)
       .style('opacity', 0.9);
     div
       .html("<strong>KTOE:</strong> <span style='color:red'>" + d.Value)
       .style('left', d3.event.pageX + 'px')
       .style('top', d3.event.pageY + 'px');
   })
   .on('mouseout', () => {
     div
       .transition()
       .duration(500)
       .style('opacity', 0);
   });

  // create x-axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - barPadding) + ")")
      .call(d3.axisBottom(xScale).tickValues(tick_x).tickFormat(d3.format("d")))
      .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")

  // create y-axis
  svg.append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(yAxis))

  // y axis title
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 8)
      .attr("dy", ".71em")
      .attr("transform", "rotate(-90)")
      .text("Renewable energy in KTOE ");


});
