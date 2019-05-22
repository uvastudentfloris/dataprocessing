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
        MEDIUM: '#306596',
        LOW: 'red',
        defaultFill: '#dddddd'
      },
      data: data,
      geographyConfig: {
        popupTemplate: function(geo, data) {
       return '<div class="hoverinfo">' + geo.properties.name + '<br />' + 'GDP ($ per capita): ' +  data['GDP ($ per capita)']
     }},
      });

    // create a legend for this map
    map.legend({
      legendTitle : "GDP ($ per capita)",
      defaultFillName: "NO DATA: "
    });
});
}
