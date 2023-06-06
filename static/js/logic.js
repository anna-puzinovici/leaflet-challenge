// Map initialization
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3
  });
  
  function defineColor(value) {
    if (value >= 0 && value < 1) return "#00FF00";
    else if (value >= 1 && value < 2) return "#ADFF2F";
    else if (value >= 2 && value < 3) return "#DAA520";
    else if (value >= 4 && value < 5) return "#FF6347";
    else if (value >= 5) return "#FF4500";
    return "#FED976";
  }
  
  // Creation of legend
  let myLegend = L.control({ position: "bottomright" });
  
  myLegend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend"),
      levels = [0, 1, 2, 3, 4, 5],
      labels = [];
  
    //  Create a label with a colored square for each interval
    for (let i = 0; i < levels.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        defineColor(levels[i]) +
        '"></i> ' +
        levels[i] +
        (levels[i + 1] ? "&ndash;" + levels[i + 1] + "<br>" : "+");
    }
  
    return div;
  };
  
  // Tile layer addition
  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    }
  ).addTo(myMap);
  
  // GeoJSON when data.beta.nyc is unavailable
  let geojsonLink =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(geojsonLink, function(data) {
    // Adding GeoJSON layer with the data
    for (let i = 0; i < data.features.length; i++) {
      let lat = data.features[i].geometry.coordinates[1];
      let long = data.features[i].geometry.coordinates[0];
      let loc = [lat, long];
      L.circle(loc, {
        fillOpacity: 0.75,
        color: "transparent",
        fillColor: defineColor(data.features[i].properties.mag),
        // Adjust the radius
        radius: data.features[i].properties.mag * 40000
      })
        .bindPopup(
          "<h1>Earthquake: " +
            data.features[i].properties.mag +
            "</h1> <hr> <h3>Location: </h3>" +
            "<h4>Latitude: " +
            lat +
            "<p>Longitude: " +
            long +
            "</h3>"
        )
        .addTo(myMap);
    }
    console.log(data);
  });
  
  myLegend.addTo(myMap);
  