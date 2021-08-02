function createMap(quakeLayer, plateLayer) {

  // Create the tile layer that will be the background of our map
  var map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // adding a satelight base map from https://docs.mapbox.com/mapbox-gl-js/example/satellite-map/
  var map2 = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    id: "satellite-v9",
    accessToken: API_KEY
  });


  // Create a baseMaps object to hold our base maps
  var baseMaps = {
    "Base Map": map,
    "Satelight": map2
  };

  // Create an overlayMaps object to hold the layers
  var overlayMaps = {
    "Earthquakes": quakeLayer,
    "Fault Lines": plateLayer
  };
  // end of adding layers

  // Create the map object with options centered on Cheyanne, WY
  var map = L.map("map-id", {
    center: [41.161079, -104.805450],
    zoom: 5,
    layers: [map, quakeLayer, plateLayer]
  });


  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Add our legend here from https://leafletjs.com/examples/choropleth/
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      // grades = [0, 10, 20, 50, 100, 200, 500, 1000],
      grades = [1, 3, 5, 10, 20, 30, 50, 1000],
      labels = [];


    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += 'Earthquake Depth<br>';
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km <br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
}

function createMarkers(response) {

  // Pull the "features" property off of response.data
  var stations = response.features;

  // Initialize an array to hold quake markers
  var quakeMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];
    var lat = stations[index].geometry.coordinates[1];
    var lng = stations[index].geometry.coordinates[0];
    var depth = stations[index].geometry.coordinates[2];
    var title = stations[index].properties.title;
    var mag = stations[index].properties.mag;
    if (depth < 0) { depth = 0; }
    var depthColor = Math.round(255 - ((depth * 1.5) ** 1.2));

    // For each station, create a marker and bind a popup with the station's name
    var quakeMarker = L.circleMarker([lat, lng], {
      fillOpacity: 0.75,
      color: "lightgrey",
      fillColor: getColor(depth),
      radius: mag * 6,
    }).bindPopup("<h3>Earthquake at: <blockquote>" + title + "</blockquote>Depth: " + depth + " km <br> Magnitude: " + mag + "</h3>");

    // // Add the marker to the quakeMarkers array
    quakeMarkers.push(quakeMarker);
  }

  // Retrieve platesURL (Tectonic Plates GeoJSON Data) with D3
  var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  var tectonicPlates = new L.LayerGroup();
  d3.json(platesURL).then(function (plateData) {
    // Create a GeoJSON Layer with the plateData
    L.geoJson(plateData, {
      color: "#DC143C",
      weight: 2
      // Add plateData to tectonicPlates LayerGroups 
    }).addTo(tectonicPlates);
  });

  // Create a layer group made from the quake markers array, pass it into the createMap function
  createMap(L.layerGroup(quakeMarkers), tectonicPlates);
}

function getColor(d) {
  return d > 1000 ? '#004529' :
    d > 50 ? '#006837' :
      d > 30 ? '#238443' :
        d > 20 ? '#41ab5d' :
          d > 10 ? '#78c679' :
            d > 5 ? '#addd8e' :
              d > 3 ? '#d9f0a3' :
                d > 1 ? '#f7fcb9' :
                  '#ffffe5';
};

// Perform an API call to the USGS API to get eaerthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
