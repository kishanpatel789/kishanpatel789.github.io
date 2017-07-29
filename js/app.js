// declare global variables
var map;
var coords = {lat: 33.755711, lng: -84.38837169999999}; // location of downtown Atlanta
var radius = 500; // meters
var defaultIcon, highlightedIcon, largeInfoWindow;
var currentMarker; // used to indicate the marker corresponding to the selected establishment
var hamburgerIcon = $('#hamburger');
var listContainer = $('#list-container');
var mapContainer = $('#map-container');

var fsClientId = 'L0DLOIYIUCZ3HGOBYKCP40HNGPCMYW13OUYYG3LQ13U5DO1Q';
var fsClientSecret = 'PF2HO5Z2ACWPKAQUYUNDLZSZHN43EXD0RYXJ1AWGST5UHIW3';
var foursquareUrlBase = 'https://api.foursquare.com/v2/venues/search?client_id=' +
  fsClientId +'&client_secret=' + fsClientSecret +'&v=20170729&intent=match&query=';

var establishmentsData = [
  {
    name: "Alma Cocina",
    lat: 33.7590563,
    lng: -84.3873043,
    address: "191 Peachtree Street Northeast, Atlanta, GA",
    type: "Restaurant"
  },
  {
    name: "Morton's The Steakhouse",
    lat: 33.762719,
    lng: -84.385836,
    address: "303 Peachtree Center Ave NE, Atlanta, GA",
    type: "Restaurant"
  },
  {
    name: "Hard Rock Cafe",
    lat: 33.7599218,
    lng: -84.38715639999999,
    address: "215 Peachtree St NE, Atlanta, GA",
    type: "Restaurant"
  },
  {
    name: "Ted's Montana Grill",
    lat: 33.7586353,
    lng: -84.3906052,
    address: "133 Luckie St NW, Atlanta, GA",
    type: "Restaurant"
  },
  {
    name: "Ray's in the City",
    lat: 33.7605594,
    lng: -84.3875618,
    address: "240 Peachtree St NW, Atlanta, GA",
    type: "Restaurant"
  },
  {
    name: "Hotel Indigo Atlanta Downtown",
    lat: 33.7609959,
    lng: -84.3875518,
    address: "230 Peachtree St NE, Atlanta, GA",
    type: "Hotel"
  },
  {
    name: "Atlanta Hilton Hotel",
    lat: 33.7616097,
    lng: -84.3832955,
    address: "255 Courtland St NE, Atlanta, GA",
    type: "Hotel"
  },
  {
    name: "Hilton Garden Inn Atlanta Downtown",
    lat: 33.7620184,
    lng: -84.3956409,
    address: "275 Baker St, Atlanta, GA",
    type: "Hotel"
  },
  {
    name: "Aloft Atlanta Downtown",
    lat: 33.7626412,
    lng: -84.38963160000002,
    address: "300 Spring St NW, Atlanta, GA",
    type: "Hotel"
  },
  {
    name: "Sheraton Atlanta Hotel",
    lat: 33.75894160000001,
    lng: -84.38331459999999,
    address: "165 Courtland St NE, Atlanta, GA",
    type: "Hotel"
  },
  {
    name: "Centennial Olympic Park",
    lat: 33.7618372,
    lng: -84.39450970000001,
    address: "265 Park Ave W NW, Atlanta, GA",
    type: "Park"
  },
  {
    name: "Woodruff Park",
    lat: 33.7561312,
    lng: -84.38815319999999,
    address: "91 Peachtree St NW, Atlanta, GA",
    type: "Park"
  },
  {
    name: "Hurt Park",
    lat: 33.7537054,
    lng: -84.3850743,
    address: "25 Courtland St SE, Atlanta, GA",
    type: "Park"
  },
  {
    name: "Hardy Ivy Park",
    lat: 33.76256,
    lng: -84.387878,
    address: "300 Peachtree St NW, Atlanta, GA",
    type: "Park"
  },
  {
    name: "Folk Art Park",
    lat: 33.7620191,
    lng: -84.3841381,
    address: "Courtland St NE, Atlanta, GA",
    type: "Park"
  },
  {
    name: "Apex Museum",
    lat: 33.7552685,
    lng: -84.38309559999999,
    address: "135 Auburn Ave NE, Atlanta, GA",
    type: "Museum"
  },
  {
    name: "Children's Museum of Atlanta",
    lat: 33.762568,
    lng: -84.39143179999999,
    address: "275 Centennial Olympic Park Dr NW, Atlanta, GA",
    type: "Museum"
  },
  {
    name: "World of Coca-Cola",
    lat: 33.7627423,
    lng: -84.39266379999999,
    address: "121 Baker St NW, Atlanta, GA",
    type: "Museum"
  },
  {
    name: "Georgia State Capitol",
    lat: 33.748994,
    lng: -84.38805029999999,
    address: "206 Washington St SW, Atlanta, GA",
    type: "Museum"
  },
  {
    name: "College Football Hall of Fame",
    lat: 33.7602216,
    lng: -84.3955424,
    address: "250 Marietta St NW, Atlanta, GA",
    type: "Museum"
  }
];

function initMap() {
  map = new google.maps.Map(document.getElementById('map-container'), {
    center: coords,  // downtown Atlanta center
    zoom: 18
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

  // add event listener to hamburger icon for mobile view
  hamburgerIcon.click(function(e) {
    listContainer.toggleClass('list-container-open');
    hamburgerIcon.css('display','none');
    e.stopPropagation();
  });

  // add event listener to map to close list-container in mobile view
  mapContainer.click(function() {
    if (window.innerWidth < 600) {
      listContainer.removeClass('list-container-open');
      hamburgerIcon.css('display','inline');
    }
  });

  ko.applyBindings(new ViewModel()); // execute view model bindings (Knockout)
  extendBoundaries();  // extend map boundaries to view all markers

} // end of initMap


// this function makes a marker for each establishment
function makeMarker(establishment) {
  var marker = new google.maps.Marker({
    position: {lat: establishment.lat, lng: establishment.lng},
    map: map,
    title: establishment.name,
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
      (data.location.address) ? marker.address = data.location.address : marker.address = 'None available';
      (data.contact.formattedPhone) ? marker.phone = data.contact.formattedPhone : marker.phone = 'None available';
      (data.contact.twitter) ? marker.twitter = '@'+data.contact.twitter : marker.twitter = 'None available';
    })
    .fail(function(results, error, message) {
      console.log('Failed to access Foursquare due to ' + message + '.');
    }

    );

  return marker;
}

// this marker updates the current marker
function changeCurrentMarker(marker) {
  if (currentMarker) {
    currentMarker.setAnimation(null); // make prior selected marker stop bouncing
  }
  currentMarker = marker;
  currentMarker.setAnimation(google.maps.Animation.BOUNCE);
  populateInfoWindow(currentMarker, largeInfoWindow);
}

// this window sets the contenet and position of the info window
function populateInfoWindow(marker, infowindow) {
  // Check to make sure info window is not already open at this marker
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div><b>Name: </b>' + marker.title + '</div>' +
                          '<div><b>Address: </b>' + marker.address + '</div>' +
                          '<div><b>Phone: </b>' + marker.phone + '</div>' +
                          '<div><b>Twitter: </b>' + marker.twitter + '</div>');
    infowindow.open(map, marker);
    // Make sure currentMarker is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      currentMarker.setAnimation(null);
    })
  }
}

// this function extends the map boundaries so all markers are visible
function extendBoundaries() {
  var bounds = new google.maps.LatLngBounds();
  establishmentsData.forEach(function(establishment) {
    bounds.extend({lat: establishment.lat, lng: establishment.lng});
  });
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}
