// dimensions of the chart
var c_start = 50;
var c_width = 800;
var c_height = 800;

// Transforming the data to screencoordinates
function createTransform(domain, range){

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
    var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

// Draws horizontal gridlines and axis and ticks
drawgrid = function(){

  var canvas=document.getElementById("LineChart");
  var ctx = canvas.getContext("2d");

  // grid size corresponds to 24 months (2 year data)
  var gridsize = c_width/24
  var gridlines = 24;
  var start = {number: 1};

  // canvas width & height
  var canvas_width = canvas.width;
  var canvas_height = canvas.height;

  // number of horizontal grid lines
  var lines = 24;

  // grid lines on x-axis
  for(var i=0; i<=lines; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;

      // if line = x-axis different color
      if(i == gridlines)
          ctx.strokeStyle = "blue";
      else
          ctx.strokeStyle = "lightgrey";

      // draw horizontal lines at gridsize
      ctx.moveTo(0, gridsize*i);
      ctx.lineTo(lines* gridsize, gridsize*i);
      ctx.stroke();
  }

  // draw ticks on x-axis
  graph_dates = ['1 jan', '1 feb', '1 mar', '1 apr', '1 may', '1 jun', '1 jul', '1 aug', '1 sept', '1 oct', '1 nov', '1 dec', '1 jan', '1 feb', '1 mar', '1 apr', '1 may', '1 jun', '1 jul', '1 aug', '1 sept', '1 oct', '1 nov', '1 dec']
  for(var i=0; i<lines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "blue";
    ctx.moveTo(gridsize*i, lines*gridsize);
    ctx.lineTo(gridsize*i, lines*gridsize-3);
    ctx.stroke()
    ctx.font = "10px Arial";
    ctx.fillText(graph_dates[i], gridsize*i, lines*gridsize + 7.5);
  }

  // temperature domain
  temp_max = 22.4;
  temp_min = -8.5;

  // temperature transfrom function
  transform_temperature = createTransform([temp_min, temp_max], [0, c_height])

  // temperatures for on y-axis
  temperatures = [-7.5, -5, -2.5, 0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20]

  // draws ticks on y-axis
  for (var i = 0; i < temperatures.length; i++){

    // determine location and draw tick
    var temp_tick = transform_temperature(temperatures[i]);
    ctx.beginPath();
    ctx.moveTo(c_width, c_height - temp_tick);
    ctx.lineTo(c_width-3, c_height - temp_tick);
    ctx.stroke()

    // write temperature at location
    ctx.font = "12px Arial";
    ctx.fillText(temperatures[i], c_width+3, c_height - temp_tick);
  }

  // write name of x-axis
  ctx.font = "12px Arial Bold";
  ctx.fillText('Months 2017 & 2018', 0, lines*gridsize + 23);

  // write name of y-axis vertically
  ctx.save();
  ctx.translate(c_width + 50, 240);
  ctx.rotate(-0.5*Math.PI);
  ctx.font = "18px Arial Bold";
  ctx.fillText('Temperature in Celsius', 0, 0);
  ctx.restore()

}

var fileName = "KNMI.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {

  // lists to add json data to
  var dates = [];
  var min_temp = [];

  if (txtFile.readyState === 4 && txtFile.status == 200) {
    var json = JSON.parse(txtFile.responseText);

    // loop through json object
    json.forEach(function(element) {

      // add the daily minimum temperatures to the list for visualization
      min_temp.push(element['TN']/10);

      // add dates of the minima
      var date = new Date(element['YYYYMMDD'].substr(0, 4) + '-' + element['YYYYMMDD'].substr(4,2) + '-' + element['YYYYMMDD'].substr(6, 2));
      dates.push(date)
    });

    const canvas = document.getElementById('LineChart');
    const ctx = canvas.getContext('2d');

    // transform functions
    transformfunctionx = createTransform([Math.min.apply(null, dates), Math.max.apply(null, dates)], [0, c_width])
    transformfunctiony = createTransform([Math.min.apply(null, min_temp), Math.max.apply(null, min_temp)], [0, c_height])

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";

    // draw lines from datapoint to datapoint
    for (var i = 0; i < dates.length; i++){

      // find locations for datapoints for display
      var date_display = transformfunctionx(dates[i])
      var min_temp_display = transformfunctiony(min_temp[i])
      ctx.lineTo(date_display, c_height - min_temp_display)
    }

    ctx.stroke();

  }
}

txtFile.open("GET", fileName);
txtFile.send();
drawgrid();
