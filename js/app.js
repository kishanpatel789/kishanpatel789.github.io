// declare global variables

// data array; this array will contain search results from Google's PlacesService API
var establishmentsData = [];

var map;
var coordsAtlanta = {lat: 33.755711, lng: -84.38837169999999};
var radius = 500; // meters
var defaultIcon, highlightedIcon;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordsAtlanta,  // downtown Atlanta center
    zoom: 18
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
        Array.prototype.push.apply(establishmentsData, results);
      } else {
        console.log('Google PlacesService failed.');
      }
      if (numAJAXreturned === establishmentTypes.length) {
        console.log('All AJAX requests completed.');
        extendBoundaries();  // extend map boundaries to view all markers
        ko.applyBindings(new ViewModel()); // execute view model bindings
      }
    });
  });

  // set default style of marker and highlighted style for mouseover
  defaultIcon = makeMarkerIcon('0091ff');
  highlightedIcon = makeMarkerIcon('FFFF24');

  // Create marker icon based on color
  function makeMarkerIcon(markerColor) {
    var markerImage = {
      url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_',
      size: new google.maps.Size(20, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(10, 30),
      scaledSize: new google.maps.Size(20, 30)
    };
    return markerImage;
  }

} // end of initMap


// this function makes a marker for each establishment
function makeMarker(data) {
  var marker = new google.maps.Marker({
    position: data.geometry.location,
    map: map,
    title: data.name,
    icon: defaultIcon,
    animation: google.maps.Animation.DROP
  });

  // add event-listeners for marker mouseover and mouse out
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });

  // add eventlistener for mouseclick

  return marker;
}

// this function extends the map boundaries so all markers are visible
function extendBoundaries() {
  var bounds = new google.maps.LatLngBounds();
  establishmentsData.forEach(function(establishment) {
    bounds.extend(establishment.geometry.location);
  });
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}
