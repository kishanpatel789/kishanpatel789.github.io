// Declare global variables
var map;
var coords = {lat: 33.755711, lng: -84.38837169999999}; // location of downtown Atlanta
var bounds, defaultIcon, highlightedIcon, largeInfoWindow; // variables used with Google Maps API
var currentMarker; // used to indicate the marker corresponding to the selected establishment
var hamburgerIcon = $('#hamburger');
var listContainer = $('#list-container');
var mapContainer = $('#map-container');

// Variables used with Foursquare API
var fsClientId = 'L0DLOIYIUCZ3HGOBYKCP40HNGPCMYW13OUYYG3LQ13U5DO1Q';
var fsClientSecret = 'PF2HO5Z2ACWPKAQUYUNDLZSZHN43EXD0RYXJ1AWGST5UHIW3';
var foursquareUrlBase = 'https://api.foursquare.com/v2/venues/search?client_id=' +
  fsClientId +'&client_secret=' + fsClientSecret +'&v=20170729&intent=match&query=';


// This initialization function is run when the AJAX request to Google Maps API returns.
// The end of the function applies knockout.js bindings for the View-Model
function initMap() {
  map = new google.maps.Map(document.getElementById('map-container'), {
    center: coords,  // downtown Atlanta center
    zoom: 18
  });

  // define boundaries of map based on establishment locations
  bounds = new google.maps.LatLngBounds();
  establishmentsData.forEach(function(establishment) {
    bounds.extend({lat: establishment.lat, lng: establishment.lng});
  });

  // recenter map if browser window changes size
  google.maps.event.addDomListener(window, 'resize', function() {
    map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
  });

  // define info window
  largeInfoWindow = new google.maps.InfoWindow();

  // set default style of marker and highlighted style for mouseover
  defaultIcon = makeMarkerIcon('1097ff');
  highlightedIcon = makeMarkerIcon('004f8c');

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

  ko.applyBindings(new ViewModel()); // execute view model bindings (Knockout)
  extendBoundaries();  // extend map boundaries to view all markers
} // end of initMap


// This function makes a marker for each establishment.
function makeMarker(establishment) {
  var marker = new google.maps.Marker({
    position: {lat: establishment.lat, lng: establishment.lng},
    map: map,
    title: establishment.name,
    icon: defaultIcon,
    animation: google.maps.Animation.DROP
  });

  // Add event-listeners for marker mouseover and mouseout
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });

  // Add eventlistener for mouseclick
  marker.addListener('click', function() {
    changeCurrentMarker(this);
  });

  // Make AJAX call to Foursquare to gather info about establishment; then store
  // info to marker
  var foursquareUrl = foursquareUrlBase + establishment.name +
    '&ll=' + establishment.lat + ',' + establishment.lng;
  $.getJSON(foursquareUrl)
    .done(function(results) {
      var data = results.response.venues[0];
      marker.address = (data.location.address) ? data.location.address : 'None available';
      marker.phone = (data.contact.formattedPhone) ? data.contact.formattedPhone : 'None available';
      marker.twitter = (data.contact.twitter) ? '@'+data.contact.twitter : 'None available';
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      alert('Failed to access Foursquare due to ' + errorThrown + '.  ' +
        jqXHR.responseJSON.meta.errorDetail);
    });

  return marker;
}

// This marker updates the current marker by adjusting marker animation and
// populating the info window on the map.
function changeCurrentMarker(marker) {
  if (currentMarker) {
    currentMarker.setAnimation(null); // make prior selected marker stop bouncing
  }
  currentMarker = marker;
  currentMarker.setAnimation(google.maps.Animation.BOUNCE);
  populateInfoWindow(currentMarker, largeInfoWindow);
}

// This function sets the content and position of the info window.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure info window is not already open at this marker
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div><b>Name: </b>' + marker.title + '</div>' +
                          '<div><b>Address: </b>' + marker.address + '</div>' +
                          '<div><b>Phone: </b>' + marker.phone + '</div>' +
                          '<div><b>Twitter: </b>' + marker.twitter + '</div>');
    infowindow.open(map, marker);
    map.panTo(marker.getPosition());

    // Make sure currentMarker is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      currentMarker.setAnimation(null); // disable marker bounce upon close of infowindow
    });
  }
}

// This function extends the map boundaries so all markers are within the boundaries.
function extendBoundaries() {
  map.fitBounds(bounds);
}
