// declare global variables

// data array; this array will contain search results from Google's PlacesService API
var establishments = [];

// this array will store all markers based on their establishment type
var markers = [];

var map;
var coordsAtlanta = {lat: 33.755711, lng: -84.38837169999999};
var radius = 500; // meters

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordsAtlanta,  // Atlanta center
    zoom: 20
  });

  // gather data on downtown Atlanta establishments and store results in
  // `establishments` array
  var placesService = new google.maps.places.PlacesService(map);
  var numAJAXreturned = 0; // used to count AJAX completions to make markers at proper time
  var establishmentTypes = ['restaurant','lodging','park','museum']; // type parameter for Google search
  // loop through establishment types and call a `nearbySearch` for each type;
  // push results to establishments array
  establishmentTypes.forEach(function(establishmentType, i) {
    var request = {
      location: coordsAtlanta,
      radius: radius,
      type: establishmentType
    };
    placesService.nearbySearch(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        numAJAXreturned++;
        Array.prototype.push.apply(establishments, results);
      } else {
        console.log('Google PlacesService failed.');
      }
      if (numAJAXreturned === establishmentTypes.length) {
        console.log('All AJAX requests completed.');
        makeMarkers();    // make markers once last AJAX request is complete
        extendBoundaries();  // extend map boundaries to view all markers
        ko.applyBindings(new ViewModel()); // execute view model bindings

      }
    });
  });

  // this function makes markers for each object in the establishments array
  function makeMarkers() {
    establishments.forEach(function(establishment) {
      var marker = new google.maps.Marker({
        position: establishment.geometry.location,
        map: map,
        title: establishment.name
      });
      markers.push(marker);
      // add event listener
    });
  }
} // end of initMap


// this function extends the map boundaries so all markers are visible
function extendBoundaries() {
  var bounds = new google.maps.LatLngBounds();
  markers.forEach(function(marker) {
    bounds.extend(marker.position);
  });
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

// this function hides all markers from the map
function hideAllMarkers() {
  markers.forEach(function(marker,i) {
    marker.setMap(null);
  });
} // end of hideAllMarkers


var ViewModel = function () {
  var self = this;
  self.establishments = establishments;
}
