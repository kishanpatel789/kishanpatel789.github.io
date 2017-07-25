// declare global variables

// data object; this object will contain search results from Google's PlacesService API
var establishments = {
  restaurants: [],
  hotels: [],
  parks: [],
  museums: []
}

// this object will store all markers based on their establishment type
var markers = {
  restaurants: [],
  hotels: [],
  parks: [],
  museums: []
};

var map;
var coordsAtlanta = {lat: 33.7489954, lng: -84.3879824};
var radius = 500; // meters

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordsAtlanta,  // Atlanta center
    zoom: 13
  });

  // gather data on downtown Atlanta establishments and store results in
  // `establishments` object
  var placesService = new google.maps.places.PlacesService(map);
  // get restaurants
  placesService.nearbySearch({
    location: coordsAtlanta,
    radius: radius,
    type: 'restaurant'
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      establishments.restaurants = results;
    }
  });
  // get hotels
  placesService.nearbySearch({
    location: coordsAtlanta,
    radius: radius,
    type: 'lodging'
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      establishments.hotels = results;
    }
  });
  // get parks
  placesService.nearbySearch({
    location: coordsAtlanta,
    radius: radius,
    type: 'park'
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      establishments.parks = results;
    }
  });
  // get museums
  placesService.nearbySearch({
    location: coordsAtlanta,
    radius: radius,
    type: 'museum'
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      establishments.museums = results;
    }
  });

  // create markers
  $.each(establishments, function(type, establishmentArray) {
    establishmentArray.forEach(function(establishment) {
      var marker = new google.maps.Marker({
        title: establishment.name,
        position: establishment.geometry.location,
        map: map
      });
      console.log(establishments);
      markers.type.push(marker);
    });
  });

console.log('hello');
  // for (var type in establishments) {
  //   establishments[type].forEach(function(establishment) {
  //     console.log(establishment);
      // var marker = new google.maps.Marker({
      //   title: establishment.name,
      //   position: establishment.geometry.location,
      //   map: map
      // });
      // markers[type].push(marker);
  //   });
  // }
  //


} // end of initMap

// this function hides all markers from the map
function hideAllMarkers() {
  for (var type in markers) {
    markers.type.forEach(function(marker) {
      marker.setMap(null);
    });
  }
} // end of hideAllMarkers
