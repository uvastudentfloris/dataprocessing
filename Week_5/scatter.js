// Floris van Lith
// 10793917
// Scatterplot

function selection() {
  d3.selectAll("svg").remove();

  var svalue1 = document.getElementById("data1").value
  var svalue2 = document.getElementById("data2").value

  var requests = [d3.json(svalue1), d3.json(svalue2)];
  Promise.all(requests).then(function(response) {

    var sdata1 = response[0];
    var sdata2 = response[1];

    sdata1 = selectcountries(sdata1)
    sdata2 = selectcountries(sdata2)

    object_2variables = scatterdata(sdata1, sdata2);
    drawScatterplot(object_2variables, 300, 500);
    drawLegend(object_2variables, 220);

  }).catch(function(e){
      throw(e);
  });

};

// out of all countries select a subset in order to create clear scatterplot
function selectcountries(data){
  var rdata = []
  var countries = ["Netherlands", "Austria", "Belgium", "Estonia", "Czech Republic", "Denmark", "Finland", "France", "Sweden", "Greece"]
  keys = Object.keys(data);
  keys.forEach(function(element){
    countries.forEach(function(i){
      if (element == i){
        rdata.push(data[element])
      }
    })
    })
    return rdata;
  }

// calculate average values of the data
function average_values(data){
  var values = Object.values(data);
  var average_values = [];

  // loop through objects
  values.forEach(function(element) {
    var average_value = 0;

    // loop through values
    element.forEach(function(values, index, array) {

      // set datalabel
      keys = Object.keys(values);
      keys.forEach(function(element){
        if (element == 'Indicator'){
          datalabel = values.Indicator;
        }
        else if (element == 'Transaction'){
          datalabel = 'GDP';
        }
      })

      var length = array.length;
      average_value += values["Datapoint"];

      // calculate average values of dataset
      if (index == length - 1){
        var object = {Country: values.Country, average_value: (average_value/array.length), Datalabel: datalabel};
        if (datalabel == "GDP"){
          object.Datalabel = "Gross Domestic Product"
          object.Datalabel1 = "GDP per head"
          average_values.push(object);
        }
        if (datalabel == "Adolescent fertility rates"){
          object.Datalabel1 = "Fertility rates"
          average_values.push(object);
        }
        if (datalabel == "Children (0-17) living in areas with problems with crime or violence (%)"){
          object.Datalabel = "Children living in areas with crime and violence"
          object.Datalabel1 = "Children (%)"
          average_values.push(object);
        }
      }
    });
  });
  return average_values;
};

// create data objects to plot in scatter
function scatterdata(data1, data2){

  data1_array = average_values(data1);
  data2_array = average_values(data2);

  var plot_objects = [];
  for(i = 0; i < data2_array.length; i++){
    for(j = 0; j < data1_array.length; j++){
      if(data1_array[j].Country == data2_array[i].Country){
        var object = {Country: data1_array[j].Country, xLabel: data1_array[j].Datalabel, xLabel1: data1_array[j].Datalabel1, xPoint: data1_array[j].average_value, yLabel: data2_array[i].Datalabel, yLabel1: data2_array[i].Datalabel1, yPoint: data2_array[i].average_value};
        plot_objects.push(object);
      }
    };
  };
  return plot_objects;
};

// create color array
var colors = ["gold", "blue", "green", "yellow", "black", "grey", "violet", "pink", "slateblue", "orange"]


function drawScatterplot(dataset, height, width){

  // assign colors to objects
  dataset.forEach(function(item, index){
    item.Colour = colors[index];
  })

  // margin for svg element
  var margin = {top: 40, right: 20, bottom: 30, left: 40};

  // create SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create div for tooltip
  var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  // create scale to map y values on SVG
  var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) { return d.xPoint; }), d3.max(dataset, function(d) { return d.xPoint; })])
    .range([0, width]);

  // create scale to map x values on SVG
  var yScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) { return d.yPoint; }), d3.max(dataset, function(d) { return d.yPoint; })])
    .range([height, 0]);

  // create label variables
  var xLabel = dataset[0].xLabel;
  var yLabel = dataset[0].yLabel;
  var xLabel1 = dataset[0].xLabel1;
  var yLabel1 = dataset[0].yLabel1;

  // x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate("+ 0 +"," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))

  // y-axis
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale))

  // graph title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(dataset[0].yLabel + " - " + dataset[0].xLabel);

  // y axis title
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 8)
      .attr("dy", ".71em")
      .attr("transform", "rotate(-90)")
      .style("font-size", "12px")
      .text(yLabel1);

  // x axis title
  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .style("font-size", "12px")
      .text(xLabel1);

  // create scatterdots
  svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
        return xScale(d.xPoint);
    })
   .attr("cy", function(d) {
      return yScale(d.yPoint);
    })
   .attr('r', 6)
   .style("fill", function(d) { return d.Colour; })
   .on('mouseover', d => {
     div
       .transition()
       .duration(200)
       .style('opacity', 0.9);
     div
       .html("<strong>x:</strong> <span style='color:red'>" + Math.round(d.xPoint) + "<span style='color:black'> & " +
       "<span style='color:black'> <strong>y:</strong><span style='color:red'>" + Math.round(d.yPoint))
       .style('left', d3.event.pageX + 'px')
       .style('top', d3.event.pageY - 60 + 'px');
   })
   .on('mouseout', () => {
     div
       .transition()
       .duration(500)
       .style('opacity', 0);
   });

}

function drawLegend(dataset, height, width){

  // create SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width )
              .attr("height", height)
              .append("g")

  // generate rects for colors
  svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", 50)
   .attr("y", function(d, i) {
      return (height - 20 -  (i * 20));
    })
   .attr("width", 10)
   .attr("height", 10)
   .attr("fill", function(d){
     return d.Colour;
   })

   // generate rects for countries
   svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", 75)
    .attr("y", function(d, i) {
       return (height - 10 - (i * 20));
     })
    .attr("width", 20)
    .attr("height", 10)
    .text(function(d){
       return d.Country;
     });
};
