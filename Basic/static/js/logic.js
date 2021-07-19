function createMap(bikeStations) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options
  // centered on Cheyanne, WY
  var map = L.map("map-id", {
    center: [41.161079, -104.805450],
    zoom: 5,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // let us see if I can add our legend here:
  // from https://leafletjs.com/examples/choropleth/
      var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            // grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            grades = [1, 3, 5, 10, 20, 30, 50, 1000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);


}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  // var stations = response.data.stations;
  var stations = response.features;

  // Initialize an array to hold bike markers
  var bikeMarkers = [];
  var test = [];

  // Loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];
    // console.log(station);
    // var test = stations[index].geometry.coordinates;
    // console.log('test = ', test);
    var lat = stations[index].geometry.coordinates[1];
    var lng = stations[index].geometry.coordinates[0];
    var depth = stations[index].geometry.coordinates[2];
    var title = stations[index].properties.title;
    var mag = stations[index].properties.mag;
    // console.log('mag = ', mag);
    if (depth < 0) { depth = 0; }
    console.log('depth = ', depth);
    // var depthColor = 255 - (parseInt(depth) **2)
    // console.log("depth rounded", Math.round(depth));
    // var depthColor = 255 - ((depth * 1.5) ** 1.2);
    var depthColor = Math.round(255 - ((depth * 1.5) ** 1.2));
    // console.log('depthcolor = ', depthColor);
    // console.log('depthcolor hex = ', depthColor.toString(16));
    // console.log('lat = ', lat);
    // console.log('lng = ', lng);
    // console.log('depth = ', depth);
    // console.log('title = ', title);

    // For each station, create a marker and bind a popup with the station's name
    // var bikeMarker = L.marker([station.lat, station.lon])
    //   .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");
    // lines below draw markers at the right locations  
    //   var bikeMarker = L.marker([lat, lng])
    // .bindPopup("<h3>" + title + "<h3><h3>Depth: " + depth + " km</h3>");
    var bikeMarker = L.circleMarker([lat, lng], {
      fillOpacity: 0.75,
      color: "lightgrey",
      // fillColor: '#00' + depthColor.toString(16) + '00',
      fillColor: getColor(depth),
      radius: mag * 6,
    
    }).bindPopup("<h3>Earthquake at: <blockquote>" + title + "</blockquote>Depth: " + depth + " km <br> Magnitude: " + mag + "</h3>");

    // // Add the marker to the bikeMarkers array
    // bikeMarkers.push(bikeMarker);
    bikeMarkers.push(bikeMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(bikeMarkers));
}

function getColor(d) {
  return d > 1000 ? '#004529' :
         d > 50  ? '#006837' :
         d > 30  ? '#238443' :
         d > 20  ? '#41ab5d' :
         d > 10  ? '#78c679' :
         d > 5   ? '#addd8e' :
         d > 3   ? '#d9f0a3' :
         d > 1   ? '#f7fcb9':
                    '#ffffe5';
};



// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
// d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
