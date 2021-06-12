// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 8
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var geoData = "Data/2019_PUMA.json";

var geojson;

// Grab data with d3
d3.json(geoData, function (data) {
  d3.csv("Data/wage_by_location.csv", function (locData) {
    console.log(locData);
    console.log(data);
    const locDataMap = new Map();

    for (let i = 0; i < locData.length; i++) {
      const element = locData[i];
      //console.log(element);
      const pumaId = element.IDPUMA;
      const avgWage = Math.round(element.AverageWage);
      locDataMap.set(pumaId, avgWage);
      // @TODO FIND THE CORRECT FEATURE AND SET THE PROPERTY
      //data.features.properties.AVGWAGE = avgWage
    }
    console.log(data.features);
    for (let j = 0; j < data.features.length; j++) {
      const element = data.features[j];
      if (j < 5) {console.log(element)}
      element.properties.AVGWAGE = locDataMap.get(element.properties.AFFGEOID10);
    }
    console.log(data);

    // Create a new choropleth layer
    geojson = L.choropleth(data, {

      // Define what  property in the features to use
      valueProperty: "AVGWAGE",

      // Set color scale
      scale: ["#f7fcfd", "#4d004b"],

      // Number of breaks in step range
      steps: 10,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },

      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Name: " + feature.properties.NAME10 + "<br>Average Wage:<br>" +
          "$" + feature.properties.AVGWAGE);
      }

    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      console.log(limits);
      var colors = geojson.options.colors;
      var labels = [];

      // Add min & max
      var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + "$" + limits[0] + "</div>" +
        "<div class=\"max\">" + "$" + limits[limits.length - 1] + "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function (limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

  });
});
