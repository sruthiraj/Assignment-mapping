var myMap = L.map("map", {
  center: [40.7, -94.5],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

function calcColor(mag) {
  if (mag < 4) {
    return "blue"
  } else if (mag < 5) {
    return "green"
  }else if(mag < 6) {
    return "orange"
  } else {
    return "red"
  }
}

d3.json(url, function (response) {
  var cities = response.features.map(
    feature => {
      var city = {}
      city.mag = feature.properties.mag
      city.coord = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
      city.place = feature.properties.place
      city.time = feature.properties.time
      // calculate color
      city.color = calcColor(city.mag)
      return city
    });

  cities.forEach((city) => {
    L.circle(city.coord, {
      color: city.color,
      fillColor: city.color,
      fillOpacity: 0.75,
      radius: 500 * city.mag * city.mag * city.mag
    }).bindPopup("<h2>" + city.place + "</h2> <hr> <h3>Date: " + new Date(city.time) + "</h3> <h3>Magnitude: " + city.mag + "</h3>").addTo(myMap)
  })
});