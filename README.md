# Leaflet-Challenge – Visualizing Data with Leaflet
Data Analytics Bootcamp 2021 Leaflet.js homework project

# Visualizing Data with Leaflet

The USGS is interested in building a new set of tools that will allow them visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet.

https://www.usgs.gov/natural-hazards/earthquake-hazards/earthquakes

## The Task

### Level 1: Basic Visualization

The first task is to visualize an earthquake data set.

1. **Get the data set**

The USGS provides earthquake data in a number of different formats, updated every 5 minutes. This project pulls from the 'All Earthquakes from the Past 7 Days' API.  http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php  

2. **Import & Visualize the Data**

   Create a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.

   * The data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher magnitudes appear larger and earthquakes with greater depth should appear darker in color.

   * Include popups that provide additional information about the earthquake when a marker is clicked.

   * Create a legend that will provide context for the map data.

- - -

### Level 2: More Data

The USGS wants to plot a second data set on the map to illustrate the relationship between tectonic plates and seismic activity. Pull in a second data set and visualize it along side the original set of data. Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.

In this step we...

* Plot a second data set on the map.

* Add a satelight base map to choose from as well as separate out the two different data sets into overlays that can be turned on and off independently.

* Add layer controls to the map.
