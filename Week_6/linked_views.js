// Floris van Lith
// 10793917

window.onload = function(){
  createdatamap();
};

// draw datamap with fillkeys from json, if existing
function createdatamap(){

  // create promise for json of gdp-data
  d3v5.json("gdp_map.json").then(function(data) {

      // draw datamap
      var map = new Datamap({element: document.getElementById('container'),
      fills: {
        HIGH: 'green',
        MEDIUM: 'pink',
        LOW: 'red',
        defaultFill: '#dddddd'
      },
      data: data,
      geographyConfig: {
        popupTemplate: function(geo, data) {
       return '<div class="hoverinfo">' + geo.properties.name + '<br />' + 'GDP ($ per capita): ' +  data['GDP ($ per capita)']
     }},
     done: function(datamap) {
         datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
             country = geo.properties.name;

             // create promise for data
             d3v5.json("employment_map.json").then(function(data) {
               bar_data = getdata(data, country)
               console.log(bar_data);

               // look if data is available
               if (bar_data != 1){
                 d3v5.select("#graph").remove()
                 drawbar(bar_data);
               }
               // if data is not available
               else{
                 d3v5.select('#graph').remove()
                 nodata();
               }
           });
       });
   }
    });

    // create a legend map
    map.legend({
      legendTitle : "GDP ($ per capita)",
      defaultFillName: "NO DATA: "
    });
  });
}

function getdata(data, country){
  data = Object.values(data);

  // get data from object
  bar_data = [];
  for(i = 0; i < data.length ; i++){
    if (data[i].Country == country){
      bar_data.push(data[i])
    }
   }
   if(bar_data.length == 0){
     return 1;
   }
  // object in the right order
  ageclasses = ["15_24", "25_54", "55_64"];
  bar_ages = [];
  for(i = 0; i < ageclasses.length; i++){

   // put age classes in the right order
   ageclass = ageclasses[i];
   for(j = 0; j < bar_data.length ; j++){
     if (bar_data[j].SUBJECT == ageclass){
       bar_ages.push(bar_data[j])
     }
   }
 }
 return bar_data

}

// create div for tooltip and bars
const divbar = d3v5.select('body').append('div')
  .attr('id', 'barcont')

const div3 = d3v5.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// replace graph with a notice
function nodata(){
  var margin = {top: 150, right: 40, bottom: 60, left: 30};
  var w = 350;
  var h = 200;
  var paddingBars = 2;

  // create new SVG element
  var svg = d3v5.select("#barcont")
              .append("svg")
              .attr("id","graph")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // append no data text to the svg element
  svg.append("text")
      .attr("x", (w / 2))
      .attr("y", 40 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("no employment data for " + country);
    }

// create promise for the json file
function drawbar(bar_data) {

  var margin = {top: 150, right: 40, bottom: 60, left: 30};
  var w = 350;
  var h = 200;
  var paddingBars = 2;

// Create SVG element
  var svg = d3v5.select("#container")
              .append("svg")
              .attr("id","graph")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create scale to map x values on SVG
  var xScale = d3v5.scaleBand()
    .domain(bar_data.map(function(d) { return d.SUBJECT; }))
    .rangeRound([0, w]).paddingInner(0.05);

  // create scale to map y values on SVG
  var yScale = d3v5.scaleLinear()
    .domain([0, d3v5.max(bar_data, function(d) { return d.Value; })])
    .range([0, h]);

  // determine sclale function for y-axis
  var aAxis = d3v5.scaleLinear()
    .domain([0, d3v5.max(bar_data, function(d) { return d.Value; })])
    .range([h, 0]);

  // draw the bars for barchart
  svg.selectAll("rect")
   .data(bar_data)
   .enter()
   .append("rect")
   .attr('x', function(d){
     return(xScale(d.SUBJECT))
   })
   .attr('y', function(d){
     return(h - yScale(d.Value))
   })
   .attr("width", w / bar_data.length - paddingBars - 10)
   .attr("height", function(d) {
        return(yScale(d.Value));
    })
   .attr("fill", 'green')
   .attr("class", "bar")

   // show tooltip when mous hovers over a bar
   .on('mouseover', d => {
     div3
       .transition()
       .duration(200)
       .style('opacity', 1);
     div3
       .html("<strong>employment (%):</strong> <span style='color:green'>" + d.Value)
       .style('left', d3v5.event.pageX + 'px')
       .style('top', d3v5.event.pageY - 28 + 'px');
   })
   // vanish when mouse leaves bar
   .on('mouseout', () => {
     div3
       .transition()
       .duration(500)
       .style('opacity', 0);
   })
// };

  // add y-axis
  svg.append("g")
   .attr('id', 'yAxis')
   .attr("class", "y axis")
   .call(d3v5.axisLeft(aAxis))
   .append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 6)
   .attr("dy", ".70em")
   .text("employment in %");

  // add x-axis
  svg.append("g")
   .attr('id', 'xAxis')
   .attr("class", "x axis")
   .attr("transform", "translate("+ 0 +"," + h + ")")
   .call(d3v5.axisBottom(xScale))
   .selectAll("text")
     .style("text-anchor", "end")
     .attr("dx", "-.8em")
     .attr("dy", "-.50em")
     .attr("transform", "rotate(-90)")
     .text(function(d, i ){
       return bar_data[i].SUBJECT
     });

   // graph title
   svg.append("text")
     .attr('id', 'title')
     .attr("x", (w / 2))
     .attr("y", 5 - (margin.top / 2))
     .attr("text-anchor", "middle")
     .style("font-size", "14px")
     .text("employment " + country);
}
